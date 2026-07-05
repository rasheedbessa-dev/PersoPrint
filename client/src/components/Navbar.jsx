import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, LogOut, Menu, X, Shirt } from 'lucide-react'
import logo from '../assets/logo.tshirt.png';

function Navbar() {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = user
    ? [
        { to: '/', label: 'Accueil' },
        { to: '/cart', label: 'Panier', icon: ShoppingCart, badge: cartItems.length },
        { to: '/orders', label: 'Commandes' },
      ]
    : [
        { to: '/', label: 'Accueil' },
        { to: '/login', label: 'Connexion' },
        { to: '/register', label: 'Inscription' },
      ]

  return (
    <nav className="bg-gradient-to-r from-dark via-secondary to-dark text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="PersoPrint" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold">Perso<span className="text-primary">Print</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="nav-link flex items-center gap-2 relative">
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
                {link.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout} className="nav-link flex items-center gap-2 text-red-400 hover:text-red-300">
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.label}
                {link.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{link.badge}</span>
                )}
              </Link>
            ))}
            {user && (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-red-400 transition-colors">
                <LogOut className="w-5 h-5" />
                Déconnexion ({user.name})
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar