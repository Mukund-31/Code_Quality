// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

// Hook consumer
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

/**
 * Ensure a profile row exists for the user.
 * Uses upsert so repeated calls are safe.
 */
async function createOrUpdateProfile(user, metadata = {}) {
  if (!user?.id) return;

  const payload = {
    id: user.id,
    name: metadata?.full_name ?? metadata?.fullName ?? metadata?.name ?? null,
    avatar_url: metadata?.avatar_url ?? metadata?.avatarUrl ?? null,
    company: metadata?.company ?? null,
    role: metadata?.role ?? null,
    // new fields
    username: metadata?.username ?? null,
    email: user?.email ?? metadata?.email ?? null,
  };

  try {
    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { returning: "minimal" });
    if (error) console.warn("profiles upsert error:", error.message);
  } catch (err) {
    console.warn("profiles upsert failed:", err);
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let listener = null;

    async function initSession() {
      // Try v2 getSession API first
      try {
        if (supabase.auth.getSession) {
          const { data } = await supabase.auth.getSession();
          const currentSession = data?.session ?? data ?? null;
          const currentUser = currentSession?.user ?? null;
          if (!mounted) return;
          setSession(currentSession);
          setUser(currentUser);
        } else if (supabase.auth.session) {
          // fallback for older libs
          const oldSession = supabase.auth.session?.() ?? null;
          setSession(oldSession);
          setUser(oldSession?.user ?? null);
        }
      } catch (err) {
        console.warn("initSession error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    // subscribe to auth changes (works with v2 and older patterns)
    try {
      const sub = supabase.auth.onAuthStateChange((event, payload) => {
        const newSession = payload ?? null;
        const newUser = payload?.user ?? null;

        setSession(newSession);
        setUser(newUser);
        setLoading(false);

        // When a user signs in (or their data updates) ensure we have a profile row
        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
          // payload.user.user_metadata for v2; for v1 metadata may be in different shape
          const meta = newUser?.user_metadata ?? newUser?.user_metadata ?? {};
          createOrUpdateProfile(newUser, meta);
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);
        }
      });

      // store the listener so we can cleanly unsubscribe on unmount
      listener = sub;
    } catch (err) {
      console.warn("auth subscription error:", err);
    }

    return () => {
      mounted = false;
      // unsubscribe for both possible shapes returned by supabase client
      try {
        // v2 returns { data: { subscription } }
        if (listener?.data?.subscription?.unsubscribe) {
          listener.data.subscription.unsubscribe();
        } else if (listener?.subscription?.unsubscribe) {
          listener.subscription.unsubscribe();
        } else if (typeof listener?.unsubscribe === "function") {
          listener.unsubscribe();
        } else if (listener?.data?.unsubscribe) {
          listener.data.unsubscribe();
        }
      } catch (e) {
        // ignore unsubscribe errors
      }
    };
  }, []);

  // === Auth helper methods ===

  // Sign up (email + password). metadata stored in auth user metadata.
  const signUp = async (email, password, metadata = {}) => {
    try {
      // v2 API: signUp({ email, password }, { data: metadata })
      if (supabase.auth.signUp) {
        const res = await supabase.auth.signUp(
          { email, password },
          { data: metadata }
        );
        // If the user is immediately returned, ensure profile exists
        const createdUser = res?.data?.user ?? res?.user ?? null;
        if (createdUser) await createOrUpdateProfile(createdUser, metadata);
        return { data: res.data ?? res, error: res.error ?? null };
      }

      // fallback / older clients (rare)
      const res = await supabase.auth.signUp({ email, password });
      const createdUser = res?.user ?? null;
      if (createdUser) await createOrUpdateProfile(createdUser, metadata);
      return { data: res, error: null };
    } catch (err) {
      return { data: null, error: err.message ?? err };
    }
  };

  // Sign in with password
  const signIn = async (email, password) => {
    try {
      if (supabase.auth.signInWithPassword) {
        const res = await supabase.auth.signInWithPassword({ email, password });
        return { data: res.data ?? res, error: res.error ?? null };
      }
      // older API
      const res = await supabase.auth.signIn({ email, password });
      return { data: res, error: null };
    } catch (err) {
      return { data: null, error: err.message ?? err };
    }
  };

  // Sign in via OAuth provider (google, github, etc.)
  const signInWithOAuth = async (provider, options = {}) => {
    try {
      if (supabase.auth.signInWithOAuth) {
        const res = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: options.redirectTo ?? `${window.location.origin}/auth/callback`,
            ...options,
          },
        });
        return { data: res.data ?? res, error: res.error ?? null };
      }
      // older API (rare)
      const res = await supabase.auth.signIn({ provider });
      return { data: res, error: null };
    } catch (err) {
      return { data: null, error: err.message ?? err };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const res = await supabase.auth.signOut();
      return { error: res?.error ?? null };
    } catch (err) {
      return { error: err.message ?? err };
    }
  };

  // Send reset password email (reset link)
  const resetPassword = async (email, options = {}) => {
    try {
      if (supabase.auth.resetPasswordForEmail) {
        const res = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: options.redirectTo ?? `${window.location.origin}/reset-password`,
        });
        return { data: res.data ?? res, error: res.error ?? null };
      }
      // older fallback
      const res = await supabase.auth.api.resetPasswordForEmail(email);
      return { data: res, error: null };
    } catch (err) {
      return { data: null, error: err.message ?? err };
    }
  };

  // Update password for the logged-in user
  const updatePassword = async (newPassword) => {
    try {
      if (supabase.auth.updateUser) {
        const res = await supabase.auth.updateUser({ password: newPassword });
        return { data: res.data ?? res, error: res.error ?? null };
      }
      // older API path
      const res = await supabase.auth.api.updateUser(supabase.auth.session()?.access_token, {
        password: newPassword,
      });
      return { data: res, error: null };
    } catch (err) {
      return { data: null, error: err.message ?? err };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
