const mongoose = require('mongoose');

const designItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
 
  positionX: { type: Number, default: 0 },
  positionY: { type: Number, default: 0 },
  width: { type: Number, default: 100 },
  height: { type: Number, default: 100 },
  rotation: { type: Number, default: 0 },
  scale: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    designs: [designItemSchema],
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);