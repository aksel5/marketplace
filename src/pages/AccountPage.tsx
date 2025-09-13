import React, { useState, useEffect } from 'react'
import { Trash2, Edit, Package, ShoppingBag, User, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMarketplace } from '../hooks/useMarketplace'
import ProductForm from '../components/ProductForm'
import ProductCard from '../components/ProductCard'
import AccountSettings from '../components/AccountSettings'

export default function AccountPage() {
  const { user } = useAuth()
  const { userProducts, userOrders, fetchUserProducts, deleteProduct, updateProduct } = useMarketplace()
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  useEffect(() => {
    if (user) {
      fetchUserProducts(user.id)
    }
  }, [user])

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await deleteProduct(productId)
      if (error) {
        setNotification({ type: 'error', message: `Failed to delete product: ${error}` })
      } else {
        setNotification({ type: 'success', message: 'Product deleted successfully!' })
        await fetchUserProducts(user!.id)
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error deleting product' })
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setShowEditForm(true)
  }

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return

    try {
      const { error } = await updateProduct(editingProduct.id, productData)
      if (error) {
        setNotification({ type: 'error', message: `Failed to update product: ${error}` })
      } else {
        setNotification({ type: 'success', message: 'Product updated successfully!' })
        setShowEditForm(false)
        setEditingProduct(null)
        await fetchUserProducts(user!.id)
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Error updating product' })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in</h3>
          <p className="text-gray-500">You need to be signed in to view your account</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* My Products Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              My Products ({userProducts.length})
            </h2>
          </div>

          {userProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-500">Start selling by listing your first item!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ProductCard product={product} showActions={false} />
                  
                  {/* Product Actions */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'sold'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Orders Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
            <ShoppingBag className="w-5 h-5 mr-2" />
            My Orders ({userOrders.length})
          </h2>

          {userOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500">Your orders will appear here</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={order.product?.images?.[0] || 'https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg'}
                            alt={order.product?.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {order.product?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Seller: {order.product?.seller?.full_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Edit Product Modal */}
      <ProductForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setEditingProduct(null)
        }}
        onSubmit={handleUpdateProduct}
        initialData={editingProduct}
        isEditing={true}
      />

      {/* Account Settings Modal */}
      <AccountSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  )
}
