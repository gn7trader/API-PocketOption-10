import express from "express";
import saldoRoutes from "./src/routes/saldo.js";
import tradesRoutes from "./src/routes/trades.js";

const app = express();

// middlewares
app.use(express.json());

// rotas
app.use("/saldo", saldoRoutes);
app.use("/trades", tradesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
