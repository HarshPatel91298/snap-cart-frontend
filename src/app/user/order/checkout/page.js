"use client";

import React from 'react'
import {CheckoutForm} from '../../components/CheckoutForm'
import {OrderSummary} from '../../components/OrderSummary'



export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <CheckoutForm />
        </div>
        
        <div className="lg:pl-12">
          <OrderSummary />
        </div>
      </div>
    </main>
  </div>
  )
}
