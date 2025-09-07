import { Router } from "express";
import { connect } from "../services/pocketOptionWS.js";

const router = Router();

// POST /saldo
router.post("/", async (req, res) => {
  try {
    const { ssid, balance_type = "PRACTICE" } = req.body || {};
    const account = await connect({ ssid, balanceType: balance_type });
    const balance = await account.getBalance();
    res.json({ success: true, balance_type, balance });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

export default router;
