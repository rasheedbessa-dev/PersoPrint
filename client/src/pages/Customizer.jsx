import React, { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { uploadImage, getProduct } from '../utils/api'
import { toast } from 'react-toastify'
import { 
  Upload, Trash2, RotateCcw, ShoppingCart, 
  Square, RectangleHorizontal, Triangle, Circle, Eclipse,
  ChevronLeft, Image as ImageIcon, Shirt
} from 'lucide-react'
import tshirtBlanc from '../assets/tshirt-W.png'
import tshirtNoir from '../assets/tshirt-B.png'
import {useEffect} from "react";
import { Rnd } from "react-rnd";
import { getDesigns } from "../utils/api";



// ============ 3 COULEURS DE T-SHIRT ============
const colorMap = {
  blanc: "#ffffff",
  noir: "#1a1a2e",
  
}






function Customizer() {
  const { productId } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [designs, setDesigns] = useState([])
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [gallery, setGallery] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [product, setProduct] = useState(null)
  useEffect(() => {
    const loadProduct = async () => {
        try {
            const res = await getProduct(productId)

            setProduct(res.data)

            if (res.data.colors.length > 0) {
                setSelectedColor({
                    name: res.data.colors[0],
                    hex:
                        res.data.colors[0] === "blanc"
                            ? "#ffffff"
                            : "#1a1a2e"
                })
            }

        } catch (err) {
            console.log(err)
        }
    }

    loadProduct()

}, [productId])
 useEffect(() => {

    const loadDesigns = async () => {
        try {

            const res = await getDesigns();

            const images = res.data.map(item => ({
                id: item.id,
                url: item.imageUrl,
                name: item.name
            }));

            setGallery(images);

        } catch (err) {
            console.log(err);
        }
    };

    loadDesigns();

}, []);
  const addImage = (imageUrl) => {
    const newDesign = {
      id: Date.now() + Math.random(),
      imageUrl,
      shape: 'none',
      x: 0, y: 0,
      width: 80, height: 80,
      rotation: 0,
    }
    setDesigns(prev => [...prev, newDesign])
    setSelectedDesign(newDesign.id)
    toast.success('Image ajoutée ! Déplacez-la sur le t-shirt.')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await uploadImage(formData)
      addImage(res.data.imageUrl)
      toast.success('Image uploadée !')
    } catch (error) {
      toast.error("Erreur lors de l'upload")
    } finally {
      setIsUploading(false)
    }
  }

  

  const removeDesign = (designId) => {
    setDesigns(prev => prev.filter(d => d.id !== designId))
    if (selectedDesign === designId) setSelectedDesign(null)
  }

  const resetAll = () => {
    setDesigns([])
    setSelectedDesign(null)
    toast.info('Design réinitialisé')
  }

  const handleAddToCart = () => {
    if (!product) {
    toast.error("Produit introuvable")
    return
}
    if (!user) {
      toast.info('Veuillez vous connecter')
      navigate('/login')
      return
    }
    if (designs.length === 0) {
      toast.warning('Ajoutez au moins une image !')
      return
    }
    const item = {

    product: product._id,

    name: product.name,

    color: selectedColor.name,

    size: selectedSize,

    designs: designs.map(d => ({
        imageUrl: d.imageUrl,
        shape: d.shape,
        positionX: d.x,
        positionY: d.y,
        width: d.width,
        height: d.height
    })),

    quantity: 1,

    price: product.basePrice

}
    console.log("productId =", productId);
    addToCart(item)
    toast.success('Ajouté au panier !')
    navigate('/cart')
  }

 

  const selectedDesignObj = designs.find(d => d.id === selectedDesign)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Personnalisez votre Personnalisez votre {product?.name}</h1>
          <p className="text-gray-500 text-sm">Glissez-déposez les images sur le t-shirt</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ===== ZONE DE PRÉVISUALISATION ===== */}
        <div className="card-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Shirt className="w-5 h-5 text-primary" /> Aperçu
            </h3>
            <button onClick={resetAll} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
              <RotateCcw className="w-4 h-4" /> Réinitialiser
            </button>
          </div>

          <div className="relative mx-auto" style={{ width: '300px', height: '380px' }}>
           <img
    src={
        selectedColor?.name === "blanc"
            ? tshirtBlanc
            : tshirtNoir
    }
    className="w-full h-full object-contain"
    alt="T-shirt"
/>
            <div className="absolute" style={{ top: '75px', left: '105px', width: '90px', height: '245px' }}>
              {designs.map((design) => (
                <Rnd
    key={design.id}
    bounds="parent"
    size={{
        width: design.width,
        height: design.height
    }}
    position={{
        x: design.x,
        y: design.y
    }}
    onDragStop={(e, d) => {
        setDesigns(prev =>
            prev.map(item =>
                item.id === design.id
                    ? { ...item, x: d.x, y: d.y }
                    : item
            )
        );
    }}
    onResizeStop={(e, direction, ref, delta, position) => {
        setDesigns(prev =>
            prev.map(item =>
                item.id === design.id
                    ? {
                          ...item,
                          width: parseInt(ref.style.width),
                          height: parseInt(ref.style.height),
                          ...position
                      }
                    : item
            )
        );
    }}
>
    <div
        onClick={() => setSelectedDesign(design.id)}
        className={`w-full h-full ${
            selectedDesign === design.id
                ? "ring-2 ring-primary"
                : ""
        }`}
    >
        <img
            src={design.imageUrl}
            alt=""
            className="w-full h-full object-contain pointer-events-none"
            draggable={false}
        />
    </div>
</Rnd>
              ))}
            </div>
          </div>

          {selectedDesignObj && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Image sélectionnée</span>
                <button onClick={() => removeDesign(selectedDesign)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
            </div>
          )}
        </div>

        {/* ===== PANNEAU DE CONTRÔLE ===== */}
        <div className="space-y-4">
          {/* Couleur */}
          <div className="card-glass p-6">
            <h3 className="font-semibold text-lg mb-4">Couleur du T-Shirt</h3>
            <div className="flex gap-4 justify-center">
              {product?.colors?.map(color => (
                <button
    key={color}
    onClick={() =>
        setSelectedColor({
            name: color,
            hex: color === "blanc" ? "#ffffff" : "#1a1a2e"
        })
    }
    className={`group relative w-16 h-16 rounded-2xl border-3 ${
        selectedColor.name === color
            ? "border-primary scale-110"
            : "border-slate-200"
    }`}
    style={{
        backgroundColor:
            color === "blanc"
                ? "#ffffff"
                : "#1a1a2e"
    }}
>
    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs">
        {color}
    </span>
</button>
              ))}
            </div>
          </div>

          {/* Taille */}
          <div className="card-glass p-6">
            <h3 className="font-semibold text-lg mb-4">Taille</h3>
            <div className="flex gap-3 justify-center">
              {product?.sizes?.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-xl font-semibold text-lg transition-all duration-300 ${selectedSize === size ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-slate-100 text-gray-600 hover:bg-slate-200'}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Images prédéfinies */}
          <div className="card-glass p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Images Disponibles (4)
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {gallery.map(img => (
              <button
                key={img.id}
                onClick={() => addImage(img.url)}
                className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all hover:scale-105 bg-slate-100"
                title={img.name}
               >
               <img
               src={img.url}
               alt={img.name}
               className="w-full h-full object-cover"
               />
             </button>
              ))}
          </div>
        </div>

          {/* Upload */}
          <div className="card-glass p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" /> Votre Image
            </h3>
            <label className="block">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                {isUploading ? (
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-sm text-gray-500 group-hover:text-primary">Cliquez pour télécharger depuis votre PC</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF (max 5MB)</p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Prix & Ajouter au panier */}
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Prix unitaire</p>
                <p className="text-3xl font-bold text-primary">{product?.basePrice} DA</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Designs</p>
                <p className="text-xl font-semibold">{designs.length}</p>
              </div>
            </div>
            <button onClick={handleAddToCart} disabled={designs.length === 0}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart className="w-5 h-5" /> Ajouter au Panier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customizer
