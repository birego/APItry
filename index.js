import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

let lastReceivedPosition = null;

app.post('/location', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

export default app;
