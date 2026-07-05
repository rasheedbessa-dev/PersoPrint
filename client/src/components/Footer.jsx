import React from 'react'
import { Link } from 'react-router-dom'
import { Shirt, Mail, Phone, MapPin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-dark via-secondary to-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shirt className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Perso<span className="text-primary">Print</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Personnalisez vos t-shirts avec style et créativité. Livraison rapide et qualité garantie.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {[{ to: '/', label: 'Accueil' }, { to: '/cart', label: 'Panier' }, { to: '/orders', label: 'Mes Commandes' }].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-primary transition-colors text-sm">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm"><Mail className="w-4 h-4 text-primary" /> contact@persoprint.dz</li>
              <li className="flex items-center gap-3 text-gray-400 text-sm"><Phone className="w-4 h-4 text-primary" /> +213 12 345 678</li>
              <li className="flex items-center gap-3 text-gray-400 text-sm"><MapPin className="w-4 h-4 text-primary" /> Alger,Algérie</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">© 2026 PersoPrint. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer