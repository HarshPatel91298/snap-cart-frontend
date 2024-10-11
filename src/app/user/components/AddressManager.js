  
  const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10 text-gray-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.75v14.5m7.25-7.25H4.75" />
    </svg>
  )
  
  export default function AddressManager() {
    const addresses =  [
      {
        id: '1',
        name: 'Harsh Patel',
        street: '1606-300 Regina Street North Tower A',
        city: 'Waterloo',
        state: 'Ontario',
        zip: 'N2J 4H2',
        country: 'Canada',
        phone: '2898892147',
        isDefault: true
      },
      {
        id: '2',
        name: 'Mital P Hirapara',
        street: '2816-308 King Street North',
        city: 'Waterloo',
        state: 'Ontario',
        zip: 'N2J 0G4',
        country: 'Canada',
        phone: '2898892147',
        isDefault: false
      },
      {
        id: '3',
        name: 'Sagar',
        street: '221 Glenridge Avenue Unit -Ph8',
        city: 'St Catharines',
        state: 'Ontario',
        zip: 'L2T 3Y7',
        country: 'Canada',
        phone: '+14375566383',
        isDefault: false
      }
    ]
  
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Addresses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col justify-center items-center h-full border rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <button className="h-20 w-20 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <PlusIcon />
              </button>
              <p className="mt-4 text-lg font-semibold">Add Address</p>
            </div>
          </div>
          {addresses.map((address) => (
            <div key={address.id} className="border rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                  {address.name}
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </h3>
              </div>
              <div className="p-4">
                <p>{address.street}</p>
                <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
                <p>{address.country}</p>
                <p>Phone: {address.phone}</p>
              </div>
              <div className="p-4 border-t flex justify-between">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                  Remove
                </button>
                {!address.isDefault && (
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  