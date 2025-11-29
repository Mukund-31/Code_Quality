import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/Dialog';
import PaymentButton from './PaymentButton';
import { CheckCircle } from 'lucide-react';

const PaymentDialog = ({ open, onOpenChange, paymentDetails, user, onSuccess }) => {
    console.log('PaymentDialog rendered. User:', user);
    if (!paymentDetails) return null;

    const { plan, amount, isUpgrade } = paymentDetails;
    console.log('PaymentDialog Details:', { plan, amount, isUpgrade });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-dark-900 border-dark-700">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-white">
                        {isUpgrade ? 'Upgrade Plan' : 'Complete Payment'}
                    </DialogTitle>
                    <DialogDescription className="text-dark-400">
                        You are about to {isUpgrade ? 'upgrade to' : 'purchase'} the <strong className="text-primary-400 capitalize">{plan}</strong> plan.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-6">
                    <div className="bg-dark-800/50 rounded-lg p-6 border border-dark-700 text-center">
                        <p className="text-dark-400 text-sm mb-2">Total Amount</p>
                        <p className="text-4xl font-bold text-white">₹{amount}</p>
                        {isUpgrade && (
                            <p className="text-xs text-green-400 mt-2 flex items-center justify-center gap-1">
                                <CheckCircle size={12} />
                                Price adjusted for upgrade
                            </p>
                        )}
                    </div>

                    <PaymentButton
                        amount={amount}
                        plan={plan}
                        user={user}
                        onSuccess={(details) => {
                            onSuccess(details);
                            onOpenChange(false);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentDialog;
