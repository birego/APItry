import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import authenticateToken from './auth/location.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();
const secretKey = process.env.SECRET_KEY || 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());

let lastReceivedPosition = null;

app.post('/location', authenticateToken, (req, res) => {
  const { latitude, longitude } = req.body;
  
  lastReceivedPosition = { latitude, longitude };

  console.log('Nouvelle position reçue:');
  console.log('Latitude:', latitude);
  console.log('Longitude:', longitude);
  
  res.status(200).json({ message: 'Position reçue avec succès!' });
});

app.get('/location', (req, res) => {
  if (lastReceivedPosition) {
    res.status(200).json(lastReceivedPosition);
  } else {
    res.status(404).json({ message: 'Aucune position n\'a été reçue encore.' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password, nom, postNom, prenom, dateDeNaissance, sex, numeroCarteElecteur, age } = req.body;
  if (!username || !password || !nom || !postNom || !prenom || !dateDeNaissance || !sex || !numeroCarteElecteur || !age) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nom,
        postNom,
        prenom,
        dateDeNaissance: new Date(dateDeNaissance),
        sex,
        numeroCarteElecteur,
        age,
      },
    });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'User registration failed', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/logout', (req, res) => {
  // Invalidate the token on the client side
  res.json({ message: 'Logged out' });
});

app.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user) {
      res.json({ user: { id: user.id, username: user.username } });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le http://localhost:${PORT}`);
});

export default app;
