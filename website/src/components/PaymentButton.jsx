import { useState } from 'react';
import { load } from '@cashfreepayments/cashfree-js';
import { supabase } from '../lib/supabase';

export default function PaymentButton({ amount, plan, user, onSuccess }) {
    const [loading, setLoading] = useState(false);

    console.log('PaymentButton rendered. User:', user);

    const handlePayment = async () => {
        console.log('handlePayment called. User prop:', user);
        console.log('Payment Amount:', amount, 'Type:', typeof amount);

        if (!amount || isNaN(amount) || amount <= 0) {
            alert('Invalid payment amount');
            return;
        }

        let currentUser = user;

        if (!currentUser) {
            // Fallback: Try to get user from Supabase directly
            const { data } = await supabase.auth.getUser();
            currentUser = data?.user;
            console.log('Fallback user fetch:', currentUser);
        }

        if (!currentUser) {
            alert('Please sign in to continue.');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order via Supabase Edge Function
            const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order', {
                body: {
                    order_amount: amount,
                    customer_details: {
                        customer_id: currentUser.id,
                        customer_name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
                        customer_email: currentUser.email,
                        customer_phone: currentUser.phone || '9999999999' // Fallback if phone not available
                    },
                    plan_id: plan, // Pass plan info to backend
                    return_url: window.location.origin + '/payment-status?order_id={order_id}'
                }
            });

            if (orderError) {
                console.error('Supabase Function Error:', orderError);
                // Try to parse the error message if it's a JSON string or object
                let errorMessage = 'Failed to create order';
                try {
                    if (orderError.message) errorMessage = orderError.message;
                    // If the error body is available and contains 'error' field
                    if (orderError.context && orderError.context.json) {
                        const errorBody = await orderError.context.json();
                        if (errorBody.error) errorMessage = errorBody.error;
                    }
                } catch (e) {
                    console.warn('Could not parse error details', e);
                }
                throw new Error(errorMessage);
            }

            if (!orderData || !orderData.payment_session_id) {
                throw new Error('Invalid order data received');
            }

            // 2. Initialize Cashfree SDK
            const cashfree = await load({
                mode: "production"
            });

            // 3. Open Checkout
            const checkoutOptions = {
                paymentSessionId: orderData.payment_session_id,
                redirectTarget: "_modal",
            };

            cashfree.checkout(checkoutOptions).then((result) => {
                if (result.error) {
                    console.error("Payment Error/Closed:", result.error);
                }
                if (result.paymentDetails) {
                    console.log("Payment Completed:", result.paymentDetails.paymentMessage);
                    // Call onSuccess callback if provided (e.g., to update UI or DB)
                    if (onSuccess) onSuccess(result.paymentDetails);
                }
            });

        } catch (error) {
            console.error('Payment Flow Error:', error);
            alert('Payment failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                </>
            ) : (
                `Pay ₹${amount}`
            )}
        </button>
    );
}
