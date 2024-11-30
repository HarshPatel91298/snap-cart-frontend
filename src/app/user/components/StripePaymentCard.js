'use client';
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentCheckoutForm from "./PaymentCheckoutPage";
import PaymentCompletePage from "./PaymentCompletePage";
import { useCheckoutStore } from '../../../utils/checkoutUtils';
import { UserAuth } from "@/context/AuthContext";



import {fetchGraphQLData} from "@/lib/graphqlClient";

const PAYMENT_INTENT_QUERY = `
  mutation CreatePaymentIntent($items: [ItemInput!]!) {
  createPaymentIntent(items: $items) {
    clientSecret
    dpmCheckerLink
  }
}
  `

// Load your test publishable API key from environment variables.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentProcess({ cartID }) {
    const [clientSecret, setClientSecret] = React.useState("");
    const [dpmCheckerLink, setDpmCheckerLink] = React.useState("");
    const [confirmed, setConfirmed] = React.useState(false);

    const { setStep } = useCheckoutStore();
    const { user } = UserAuth();

  
    React.useEffect(() => {
      // Check if there is a payment intent client secret in the URL
      const queryParams = new URLSearchParams(window.location.search);
      const paymentIntentClientSecret = queryParams.get("payment_intent_client_secret");
      setConfirmed(!!paymentIntentClientSecret);
    }, []);
  
    React.useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      const createPaymentIntent = async () => {
        const data = await fetchGraphQLData(PAYMENT_INTENT_QUERY, {
          items: [{ cart_id : cartID }],
        });
        setClientSecret(data.createPaymentIntent.clientSecret);
        setDpmCheckerLink(data.createPaymentIntent.dpmCheckerLink);
      };

      if (user) {
        createPaymentIntent();
      }
      createPaymentIntent();
    }, [user]);
  
    const appearance = {
      theme: 'flat',
    };
    const options = {
      clientSecret,
      appearance,
    };
  
    return (
      <>
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            {confirmed ? (
              <PaymentCompletePage />
            ) : (
              <PaymentCheckoutForm dpmCheckerLink={dpmCheckerLink} />
            )}
          </Elements>
        )}
      </>
    );
  }