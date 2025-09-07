import { Router } from "express";
import { connect } from "../services/pocketOptionWS.js";

const router = Router();

// POST /ordem
router.post("/", async (req, res) => {
  if (req.path !== "/") return; // garante que é a rota /ordem
  try {
    const { ssid, balance_type = "PRACTICE", ativo, direcao, valor, expiracao } = req.body || {};
    const account = await connect({ ssid, balanceType: balance_type });
    const result = await account.buy({ valor, ativo, direcao, expiracao });
    if (!result.success) return res.status(400).json(result);
    res.json({ success: true, order_id: result.order_id });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// POST /resultado
router.post("/resultado", async (req, res) => {
  try {
    const { ssid, balance_type = "PRACTICE", order_id } = req.body || {};
    const account = await connect({ ssid, balanceType: balance_type });
    const info = await account.getOrder(order_id);
    if (!info) return res.status(404).json({ success: false, error: "Ordem não encontrada." });
    res.json({ success: true, order_id, ...info });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
