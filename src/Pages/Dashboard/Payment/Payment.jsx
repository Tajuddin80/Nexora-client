import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MakePayment from "./MakePayment/MakePayment";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_PUBLISH_KEY);
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <MakePayment></MakePayment>
    </Elements>
  );
};

export default Payment;
