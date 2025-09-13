import React, { useState } from 'react'
import { Plus, ShoppingBag, User, Search, Filter, Menu } from 'lucide-react'
import AuthModal from '../components/AuthModal'
import ProductCard from '../components/ProductCard'
import ProductForm from '../components/ProductForm'
import { useAuth } from '../hooks/useAuth'
import { useMarketplace } from '../hooks/useMarketplace'
import { useMobile } from '../hooks/useMobile'

export default function MarketplacePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const { user, loading: authLoading } = useAuth()
  const { products, categories, loading: marketLoading, createProduct, createOrder, fetchProducts } = useMarketplace()
  const isMobile = useMobile()

  const handleCreateProduct = async (productData: any) => {
    const { error } = await createProduct(productData)
    if (error) {
      setNotification({ type: 'error', message: `Failed to create product: ${error}` })
    } else {
      setNotification({ type: 'success', message: 'Product listed successfully!' })
      setShowProductForm(false)
      await fetchProducts()
    }
  }

  const handleBuyProduct = async (productId: string) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    try {
      const { error } = await createOrder(productId)
      if (error) {
        setNotification({ type: 'error', message: `Error creating order: ${error}` })
      } else {
        setNotification({ type: 'success', message: 'Order created successfully! The seller will contact you soon.' })
        await fetchProducts()
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error creating order' })
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    const matchesSearch = !searchQuery || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (authLoading || marketLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="absolute top-1 right-1 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Marketplace</h1>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
            <div className="p-4 space-y-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setShowProductForm(true)
                      setShowMobileMenu(false)
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all w-full justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Sell Item</span>
                  </button>
                  <a
                    href="/account"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors w-full justify-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </a>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all w-full"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 md:max-w-7xl md:mx-auto md:px-6 md:py-8">
        {/* Categories Filter */}
        <div className="flex items-center space-x-3 mb-6 md:mb-8">
          <Filter className="w-4 h-4 text-gray-600 md:w-5 md:h-5" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-sm md:px-4 md:py-2 md:text-base ${
                !selectedCategory
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors text-sm md:px-4 md:py-2 md:text-base ${
                  selectedCategory === category.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3 md:w-16 md:h-16 md:mb-4" />
            <h3 className="text-base font-medium text-gray-900 mb-1 md:text-lg md:mb-2">No products found</h3>
            <p className="text-sm text-gray-500 md:text-base">
              {searchQuery || selectedCategory 
                ? 'Try adjusting your search' 
                : 'Be the first to list an item!'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={handleBuyProduct}
                showActions={true}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 safe-area-inset-bottom">
          <div className="flex justify-around items-center py-3 px-4">
            {user ? (
              <>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="flex flex-col items-center p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Sell</span>
                </button>
                <a
                  href="/account"
                  className="flex flex-col items-center p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Account</span>
                </a>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex flex-col items-center p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <User className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ProductForm
        isOpen={showProductForm}
        onClose={() => setShowProductForm(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
      />
    </div>
  )
}
