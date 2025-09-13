import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react'
import { useDeviceDetection } from '../hooks/useDeviceDetection'

export default function HomePage() {
  const device = useDeviceDetection()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="container-responsive py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Welcome to the Ultimate Marketplace
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Buy and sell with confidence. Join thousands of users trading everything from electronics to collectibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                to="/marketplace"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 btn-touch w-full sm:w-auto"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/auth"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all btn-touch w-full sm:w-auto"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Marketplace?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Experience the best platform for buying and selling with these amazing features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Transactions",
                description: "All transactions are protected with industry-leading security measures and buyer protection."
              },
              {
                icon: TrendingUp,
                title: "Best Prices",
                description: "Find the best deals and competitive prices from trusted sellers worldwide."
              },
              {
                icon: Users,
                title: "Community Trust",
                description: "Join a community of verified users with ratings and reviews for every transaction."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Only show on desktop/tablet */}
      {!device.isMobile && (
        <section className="bg-gray-100 py-12 md:py-16">
          <div className="container-responsive">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { number: '10K+', label: 'Active Users' },
                { number: '50K+', label: 'Products' },
                { number: '99%', label: 'Satisfaction Rate' },
                { number: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
