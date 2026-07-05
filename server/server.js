// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Debug
console.log('🔍 MONGO_URI:', process.env.MONGO_URI || 'NON DÉFINIE');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion MongoDB avec gestion d'erreur
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI non définie dans .env');
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout rapide pour diagnostiquer
    });
    
    console.log('✅ MongoDB connecté:', conn.connection.host);
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err.message);
    console.error('→ Le serveur va quand même démarrer mais les requêtes échoueront');
    // Ne quitte pas le process pour voir l'erreur dans le navigateur
  }
};

connectDB();
app.use(express.static(path.join(__dirname, "client/dist")));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API PersoPrint fonctionne !',
    mongoConnected: mongoose.connection.readyState === 1 
  });
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
  console.error('💥 Erreur:', err.message);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
