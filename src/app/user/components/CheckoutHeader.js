import React from 'react';
import { useCheckoutStore } from '../../../utils/checkoutUtils';


export const Header = () => {
  const step = useCheckoutStore((state) => state.step);

  const steps = [
    { id: 'checkout', label: 'Checkout' },
    { id: 'review', label: 'Review and Pay' },
    { id: 'confirmation', label: 'Order confirmation' }
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <header className="border-b border-gray-200 bg-white px-6 py-6 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center space-y-8">
          
          <div className="w-full max-w-2xl">
            <div className="flex justify-between mb-2">
              {steps.map((s, index) => (
                <div
                  key={s.id}
                  className={`flex-1 text-center ${
                    index === currentStepIndex
                      ? 'text-gray-900 font-medium'
                      : index < currentStepIndex
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>
            
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-300"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
                }}
              />
              <div className="relative flex justify-between">
                {steps.map((s, index) => (
                  <div
                    key={s.id}
                    className={`w-4 h-4 rounded-full border-2 ${
                      index <= currentStepIndex
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
