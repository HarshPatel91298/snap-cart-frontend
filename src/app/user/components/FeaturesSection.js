export default function FeaturesSection() {
  const features = [
    { icon: '🚚', text: 'Free Shipping Worldwide' },
    { icon: '🔄', text: 'Return & Exchanges' },
    { icon: '💻', text: 'Technical Support' },
    { icon: '🎁', text: 'Daily Gift Vouchers' },
  ]

  return (
    <div className="bg-gray-100 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center text-black">
            {' '}
            <div className="text-4xl mb-2">{feature.icon}</div>
            <p className="text-black">{feature.text}</p>{' '}
          </div>
        ))}
      </div>
    </div>
  )
}
