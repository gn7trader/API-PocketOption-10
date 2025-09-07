import { Router } from "express";
import { connect } from "../services/pocketOptionWS.js";

const router = Router();

// POST /candles
router.post("/", async (req, res) => {
  try {
    const { ssid, balance_type = "PRACTICE", ativo, periodo = 60, quantidade = 10 } = req.body || {};
    const account = await connect({ ssid, balanceType: balance_type });
    const candles = await account.getCandles({ ativo, periodo, quantidade });
    res.json({ success: true, ativo, periodo, quantidade, candles });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
