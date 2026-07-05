const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, adminOnly } = require('../middleware/auth');

// GET toutes les commandes
router.get('/', auth, async (req, res) => {
  try {
    let orders;
    if (req.user.isAdmin) {
      orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product');
    } else {
      orders = await Order.find({ user: req.user.userId })
        .populate('items.product');
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET une commande par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    
    if (order.user.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST créer une commande
router.post("/", auth, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const order = new Order({
      user: req.user.userId,
      items,
      totalAmount,
      shippingAddress,
      status: "pending"
    });

    await order.save();
    await order.populate("items.product");

    res.status(201).json(order);

  } catch (error) {

    console.error("ERREUR ORDER:");
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack
    });

  }
});
// PUT mettre à jour le statut (admin)
router.put('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE annuler une commande
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée.' });
    }
    
    if (order.user.toString() !== req.user.userId && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé.' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Impossible d\'annuler une commande déjà traitée.' });
    }
    
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Commande annulée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;