import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook for fetching data from Supabase
 * @param {string} table - Table name
 * @param {object} options - Query options
 */
export const useSupabaseQuery = (table, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabase.from(table).select(options.select || '*');

        // Apply filters
        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        // Apply ordering
        if (options.orderBy) {
          query = query.order(options.orderBy.column, {
            ascending: options.orderBy.ascending ?? true,
          });
        }

        // Apply limit
        if (options.limit) {
          query = query.limit(options.limit);
        }

        // Apply range
        if (options.range) {
          query = query.range(options.range.from, options.range.to);
        }

        const { data: result, error: queryError } = await query;

        if (queryError) throw queryError;

        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error };
};

/**
 * Custom hook for real-time subscriptions
 * @param {string} table - Table name
 * @param {function} callback - Callback function for changes
 * @param {object} options - Subscription options
 */
export const useSupabaseSubscription = (table, callback, options = {}) => {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: options.event || '*', // INSERT, UPDATE, DELETE, or *
          schema: options.schema || 'public',
          table: table,
          filter: options.filter,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, JSON.stringify(options)]);
};

/**
 * Custom hook for CRUD operations
 * @param {string} table - Table name
 */
export const useSupabaseMutation = (table) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Insert data
  const insert = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (insertError) throw insertError;

      return { data: result, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update data
  const update = async (id, data) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: updateError } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      return { data: result, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete data
  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    insert,
    update,
    remove,
    loading,
    error,
  };
};
