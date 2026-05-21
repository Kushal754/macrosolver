import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import macroRoutes from './routes/macroRoutes.js';

console.log("STATUS DE LA API KEY:", process.env.GEMINI_API_KEY ? "CARGADA CORRECTAMENTE" : "VACÍA O NO ENCONTRADA");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Aquí enganchamos el mapa real de nuestra API
app.use('/api/v1', macroRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor de MacroSolver AI ejecutándose en http://localhost:${PORT}`);
});