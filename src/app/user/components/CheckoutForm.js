import React, { useState, useEffect } from "react";
import { useCheckoutStore } from "../../../utils/checkoutUtils";
import { fetchGraphQLData } from "@/lib/graphqlClient";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from 'nextjs-toploader/app';
import { useCart } from "../../../context/CartContext";

const QUERY_GET_ADDRESSES = `
 query Query {
  addresses {
    totalCount
    message
    data {
      id
      userId
      name
      street
      apartment
      city
      province
      postalCode
      country
      poBox
      phone
      isDefault
      createdAt
      updatedAt
    }
  }
}
`;

export const CheckoutForm = () => {
  const { user } = UserAuth();
  const { setStep, setShippingAddress } = useCheckoutStore();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [createNewAddress, setCreateNewAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For error message

  // Cart context : Save the selected address id to cart context to reuse in Order creation
  const { selectedAddressID, setSelectedAddressID } = useCart();

  // Router
  const router = useRouter();

  // Fetch the addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetchGraphQLData(QUERY_GET_ADDRESSES);
        if (response && response.addresses && response.addresses.data) {
          setSavedAddresses(response.addresses.data);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleAddressSelection = (addressId) => {
    setSelectedAddressID(addressId);
    setCreateNewAddress(false); // Close the form if an address is selected
    setErrorMessage(""); // Clear error message on valid selection
    const selectedAddress = savedAddresses.find((addr) => addr.id === addressId);
    if (selectedAddress) {
      setShippingAddress(selectedAddress);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAddressID) {
      setErrorMessage("Please select a shipping address.");
      return;
    }
    router.push("/user/order/payment/payment-process");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping address</h2>
        <div className="space-y-4">
          {savedAddresses.map((address) => (
            <label
              key={address.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer ${selectedAddressID === address.id ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            >
              <input
                type="radio"
                name="address"
                value={address.id}
                className="mr-3"
                onChange={() => handleAddressSelection(address.id)}
                checked={selectedAddressID === address.id}
              />
              <div>
                <p className="text-sm font-medium">{address.name}</p>
                <p className="text-sm">{address.street}</p>
                {address.apartment && <p className="text-sm">{address.apartment}</p>}
                <p className="text-sm">
                  {address.city}, {address.province} {address.postalCode}
                </p>
                <p className="text-sm">Phone: {address.phone}</p>
              </div>
            </label>
          ))}

          {/* <button
            type="button"
            className="w-full px-4 py-2 text-blue-600 hover:text-blue-700"
            onClick={() => {
              setCreateNewAddress(true);
              setSelectedAddressId(null); // Unselect previous address when adding a new address
            }}
          >
            Add a new address
          </button> */}
        </div>

        {createNewAddress && (
          <div className="mt-4 space-y-4">
            {/* Form fields for adding a new address */}
          </div>
        )}

        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>

      <div>
        {/* <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping method</h2> */}
        <div className="space-y-2">
          {/* Shipping method options */}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          
        >
          Process Payment
        </button>
      </div>
    </form>
  );
};
