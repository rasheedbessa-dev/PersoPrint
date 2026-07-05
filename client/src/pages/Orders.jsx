import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../utils/api'
import { toast } from 'react-toastify'
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, Calendar } from 'lucide-react'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try { const res = await getOrders(); setOrders(res.data) }
    catch (error) { toast.error('Erreur') }
    finally { setLoading(false) }
  }

  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    processing: { label: 'En traitement', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Package },
    shipped: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Truck },
    delivered: { label: 'Livrée', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
  }

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/" className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><ArrowLeft className="w-6 h-6" /></Link>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" /> Mes Commandes
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune commande</h3>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">Découvrir nos produits</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const status = statusConfig[order.status] || statusConfig.pending
            const StatusIcon = status.icon
            return (
              <div key={order._id} className="card-glass p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500">Commande #{index + 1}</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" /> {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span className="flex items-center gap-1"><Package className="w-4 h-4" /> {order.items.length} article(s)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{order.totalAmount.toFixed(2)} DA</p>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-sm">
                      <div className={`w-10 h-10 rounded-lg ${item.color === 'blanc' ? 'bg-white border' : item.color === 'noir' ? 'bg-gray-900' : 'bg-red-500'}`} />
                      <div className="flex-grow">
                        <p className="font-medium">T-Shirt Personnalisé</p>
                        <p className="text-gray-500 text-xs">{item.color} • Taille {item.size} • {item.designs.length} design(s)</p>
                      </div>
                      <span className="font-semibold">{item.price.toFixed(2)} DA</span>
                    </div>
                  ))}
                </div>
                {order.shippingAddress && (
                  <div className="border-t mt-4 pt-4 text-sm text-gray-500">
                    <p className="font-medium text-gray-700 mb-1">Livraison:</p>
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders