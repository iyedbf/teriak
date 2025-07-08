// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const produitRoutes = require('./routes/produitRoutes');
const poinconRoutes = require('./routes/poinconRoutes');
const fournisseurRoutes = require('./routes/fournisseurRoutes');
const marqueRoutes = require('./routes/marqueRoutes');
const formeRoutes = require('./routes/formeRoutes');
const etatPoinconRoutes = require('./routes/etatPoinconRoutes');


dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes de test
app.get('/', (req, res) => {
  res.send('🚀 API Poinçons en ligne !');
});

// Connexion DB + démarrage serveur
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/poincons', poinconRoutes);
app.use('/api/fournisseurs', fournisseurRoutes);
app.use('/api/marques', marqueRoutes);
app.use('/api/formes', formeRoutes);
app.use('/api/etatpoincons', etatPoinconRoutes);






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🟢 Serveur démarré sur http://localhost:${PORT}`);
});
