import { create } from 'zustand';

export const useCheckoutStore = create((set) => ({
  step: 'checkout',
  cartItems: [
    {
      id: '1',
      name: 'Nike Air Force 1',
      price: 150,
      color: 'White',
      size: 'M',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80'
    },
    {
      id: '2',
      name: 'Camo Blend Jacket',
      price: 40,
      originalPrice: 80,
      color: 'Camo',
      size: 'M',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80'
    },
    {
      id: '3',
      name: 'Mahabis Classic',
      price: 39,
      color: 'White',
      size: 'M',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80'
    }
  ],
  email: '',
  shippingAddress: null,
  shippingMethod: '2-4 working days',
  orderSummary: {
    subtotal: 229,
    shipping: 0,
    tax: 0,
    discount: 20,
    total: 229
  },
  setStep: (step) => set({ step }),
  setEmail: (email) => set({ email }),
  setShippingAddress: (address) => set({ shippingAddress: address }),
  setShippingMethod: (method) => set({ shippingMethod: method })
}));
