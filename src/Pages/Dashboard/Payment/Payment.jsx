import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MakePayment from "./MakePayment/MakePayment";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Loader from "../../../Shared/component/Loader/Loader";

let stripePromiseCache = null;

const getStripePromise = (key) => {
  if (!key || typeof key !== "string" || !key.startsWith("pk_")) return null;
  if (!stripePromiseCache || stripePromiseCache.key !== key) {
    stripePromiseCache = {
      key,
      promise: loadStripe(key),
    };
  }
  return stripePromiseCache.promise;
};

const Payment = () => {
  const axiosPublic = useAxiosPublic();
  const envKey = import.meta.env.VITE_PAYMENT_PUBLISH_KEY;
  const [publishableKey, setPublishableKey] = useState(envKey || "");
  const [isLoadingKey, setIsLoadingKey] = useState(!envKey);

  useEffect(() => {
    if (envKey) {
      setPublishableKey(envKey);
      setIsLoadingKey(false);
      return;
    }

    let isMounted = true;
    axiosPublic
      .get("/stripe-publishable-key")
      .then((res) => {
        if (isMounted) {
          if (res.data?.publishableKey) {
            setPublishableKey(res.data.publishableKey);
          }
          setIsLoadingKey(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingKey(false);
      });

    return () => {
      isMounted = false;
    };
  }, [envKey, axiosPublic]);

  if (isLoadingKey) {
    return <Loader />;
  }

  const stripePromise = getStripePromise(publishableKey);

  // ALWAYS wrap in <Elements> (even if stripe is null) so useStripe() and useElements() never throw
  return (
    <Elements stripe={stripePromise || null}>
      <MakePayment publishableKey={publishableKey} />
    </Elements>
  );
};

export default Payment;
