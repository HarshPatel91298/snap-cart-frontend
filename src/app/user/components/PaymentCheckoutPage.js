import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
require("dotenv").config();


export default function CheckoutForm({ dpmCheckerLink }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't yet loaded
    }

    setIsLoading(true);

    const FRONTEND_DOMAIN = process.env.NEXT_PUBLIC_APP_FRONTEND_DOMAIN;
    console.log("FRONTEND_DOMAIN", FRONTEND_DOMAIN);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Change this to your payment completion page
        return_url: `${FRONTEND_DOMAIN}/user/order/payment/payment-process`,
      },
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit} className="w-[70%] mx-auto">
        <PaymentElement id="payment-element" options={paymentElementOptions} />

        <button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          className={`w-full py-3 mt-3 text-lg font-semibold text-white rounded-lg transition-all ${isLoading || !stripe || !elements ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"}`}
        >
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          </span>
        </button>

        {message && <div id="payment-message" className="text-red-500 text-sm mt-2">{message}</div>}
      </form>
    </>
  );
}
