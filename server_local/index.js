import express from 'express';
import cors from 'cors';
import puzzleRoutes from './routes/puzzle.js';
import wordRoutes from './routes/word.js';

const app = express();
const PORT = 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/puzzle', puzzleRoutes);
app.use('/api/word', wordRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎮 WordWink server running on http://localhost:${PORT}`);
});
