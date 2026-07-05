import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { createOrder } from '../utils/api'
import { toast } from 'react-toastify'
import { ShoppingBag, Trash2, ArrowLeft, Truck, MapPin, User, CreditCard, Package } from 'lucide-react'

function Cart() {
  const { cartItems, removeFromCart, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '', address: '', city: '', postalCode: '', country: 'Algérie'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCheckout = async () => {
    if (!user) { toast.info('Connectez-vous pour commander'); navigate('/login'); return }
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city) {
      toast.error('Remplissez tous les champs obligatoires'); return
    }
    setIsSubmitting(true)
    try {
      await createOrder({ items: cartItems, totalAmount: getTotal(), shippingAddress })
      toast.success('Commande passée !')
      clearCart()
      navigate('/orders')
    } catch (error) { toast.error('Erreur') }
    finally { setIsSubmitting(false) }
  }

  const colorMap = { blanc: 'bg-white', noir: 'bg-gray-900' }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Panier vide</h2>
          <p className="text-gray-500 mb-6">Personnalisez votre t-shirt !</p>
          <button onClick={() => navigate('/')} className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-primary" /> Panier
          <span className="text-sm font-normal text-gray-500 bg-slate-100 px-3 py-1 rounded-full">{cartItems.length} article(s)</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="card-glass p-5 flex gap-5">
              <div className={`w-24 h-24 rounded-xl ${colorMap[item.color] || 'bg-gray-400'} flex items-center justify-center border-2 border-slate-200 shrink-0`}>
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">T-Shirt Personnalisé</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${colorMap[item.color]} border border-slate-300`} /> {item.color}
                  </span>
                  <span>Taille: <strong>{item.size}</strong></span>
                  <span>Designs: <strong>{item.designs.length}</strong></span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-primary">{item.price.toFixed(2)} DA</span>
                  <button onClick={() => removeFromCart(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card-glass p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Livraison
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input placeholder="Nom complet *" className="input-field pl-9 text-sm" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input placeholder="Adresse *" className="input-field pl-9 text-sm" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Ville *" className="input-field text-sm" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} />
                <input placeholder="Code postal" className="input-field text-sm" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="card-glass p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Récapitulatif
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Sous-total</span><span>{getTotal().toFixed(2)} DA</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Livraison</span><span className="text-green-600 font-medium">Gratuite</span></div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">{getTotal().toFixed(2)} DA</span>
              </div>
            </div>
            <button onClick={handleCheckout} disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CreditCard className="w-4 h-4" /> Passer la Commande</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart