import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MakePayment from "./MakePayment/MakePayment";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_PUBLISH_KEY);
const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <MakePayment></MakePayment>
    </Elements>
  );
};

export default Payment;
