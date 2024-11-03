'use client';
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentCheckoutForm from "../../../components/PaymentCheckoutPage";
import PaymentCompletePage from "../../../components/PaymentCompletePage";

import {fetchGraphQLData} from "../../../../../lib/graphqlClient";

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

export default function PaymentProcess({ children }) {
    const [clientSecret, setClientSecret] = React.useState("");
    const [dpmCheckerLink, setDpmCheckerLink] = React.useState("");
    const [confirmed, setConfirmed] = React.useState(false);
  
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
          items: [{ order_id : "672576466af9e093f2edf652" }],
        });
        setClientSecret(data.createPaymentIntent.clientSecret);
        setDpmCheckerLink(data.createPaymentIntent.dpmCheckerLink);
      };
      createPaymentIntent();
    }, []);
  
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