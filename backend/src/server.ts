import express from 'express';
import cors from 'cors';
import carsRouter from './routes/cars';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: "Hanna's Car Inventory API is running!" });
});

app.use('/api/cars', carsRouter);

app.listen(PORT, () => {
  console.log(`🚗⚡ Server running on http://localhost:${PORT}`);
});

export default app;
