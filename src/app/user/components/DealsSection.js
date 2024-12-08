/* eslint-disable @next/next/no-img-element */
const DealsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
    {/* Map over deal items */}
    {deals.map((deal) => (
      <div key={deal.id} className="bg-white p-4 rounded-lg shadow-lg">
        <img
          src={deal.image}
          alt={deal.name}
          className="w-full h-40 object-cover mb-4"
        />
        <h3 className="text-xl font-bold">{deal.title}</h3>
        <p className="text-red-500 mt-2">{deal.discount}% off</p>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
          Shop Now
        </button>
      </div>
    ))}
  </div>
)
