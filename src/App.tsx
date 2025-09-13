import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ResponsiveNavigation from './components/ResponsiveNavigation'
import HomePage from './pages/HomePage'
import MarketplacePage from './pages/MarketplacePage'
import AccountPage from './pages/AccountPage'
import AuthPage from './pages/AuthPage'
import MobileOptimizer from './components/MobileOptimizer'
import { usePWA } from './hooks/usePWA'

function App() {
  usePWA()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <MobileOptimizer />
        <ResponsiveNavigation />
        
        <main className="safe-area-top safe-area-bottom">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
