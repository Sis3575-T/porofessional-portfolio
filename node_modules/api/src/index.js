import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

app.get('/api/hero', (req, res) => {
  res.json({
    title: 'Full Stack Developer',
    subtitle: 'Building premium digital experiences',
    description: 'I create modern, responsive, and high-performing web applications.'
  });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
