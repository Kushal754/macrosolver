// server/src/index.ts
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: '¡El backend de MacroSolver AI está vivo!' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor de MacroSolver AI ejecutándose en http://localhost:${PORT}`);
});