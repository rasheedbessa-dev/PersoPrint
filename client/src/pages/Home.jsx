import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../utils/api'
import { toast } from 'react-toastify'
import { Shirt, Sparkles, Truck, Shield, ArrowRight } from 'lucide-react'

function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => { loadProducts() }, [])

  const loadProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch (error) {
      toast.error('Erreur de chargement')
      setProducts(getDefaultProducts())
    }
  }

 

  const features = [
    { icon: Sparkles, title: 'Design Unique', desc: 'Créez votre propre style' },
    { icon: Truck, title: 'Livraison Rapide', desc: 'Partout en Algérie' },
    { icon: Shield, title: 'Qualité Garantie', desc: '100% coton premium' },
  ]

  const colorMap = { blanc: 'bg-white border-gray-300', noir: 'bg-gray-900' }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-dark via-secondary to-dark text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Créez votre <span className="text-primary">T-Shirt</span> Unique
              </h1>
              <p className="text-gray-300 text-lg mb-8 max-w-md">
                Personnalisez vos t-shirts avec nos outils simples. Choisissez la couleur, ajoutez des images et créez votre style !
              </p>
              {products.length > 0 && (
    <Link
        to={`/customizer/${products[0]._id}`}
        className="btn-primary inline-flex items-center gap-2 text-lg"
    >
        Commencer <ArrowRight className="w-5 h-5" />
    </Link>
)}
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-80 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center border border-primary/20">
                  <Shirt className="w-32 h-32 text-primary" />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feat.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nos <span className="text-primary">T-Shirts</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product._id} className="card-glass overflow-hidden">
                <div className="h-56 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                  <Shirt className="w-24 h-24 text-slate-400" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {product.colors.map(c => (
                      <div key={c} className={`w-6 h-6 rounded-full border-2 ${colorMap[c] || 'bg-gray-400'}`} title={c} />
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.basePrice.toFixed(2)} DA</span>
                    <Link to={`/customizer/${product._id}`} className="btn-primary text-sm">Personnaliser</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home