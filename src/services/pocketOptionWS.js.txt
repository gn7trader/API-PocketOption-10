// === SIMULAÇÃO/PLACEHOLDER ===
// Mantém um "estado" em memória para testar as rotas.
const state = {
  balances: {
    PRACTICE: 10000,
    REAL: 25.37
  },
  orders: {} // order_id -> { status, win, profit }
};

// Gera IDs de ordem mock
const newOrderId = () => Math.floor(Math.random() * 1_000_000);

// Conexão (placeholder)
export async function connect({ ssid, balanceType = "PRACTICE" }) {
  if (!ssid || typeof ssid !== "string") {
    throw new Error("SSID ausente ou inválido.");
  }
  if (!["PRACTICE", "REAL"].includes(balanceType)) {
    throw new Error("balanceType inválido. Use PRACTICE ou REAL.");
  }
  // Retorna "objeto de conta" com métodos
  return {
    async getBalance() {
      return state.balances[balanceType];
    },
    async buy({ valor, ativo, direcao, expiracao }) {
      // Regras simples de validação
      if (!ativo || !["call", "put"].includes(String(direcao).toLowerCase())) {
        return { success: false, error: "Parâmetros de ordem inválidos." };
      }
      if (valor <= 0) return { success: false, error: "Valor deve ser > 0." };

      const id = newOrderId();
      // Debita valor simulado e cria ordem pendente
      state.balances[balanceType] -= valor;
      state.orders[id] = { status: "open", win: null, profit: 0, stake: valor };

      // Simula fechamento da ordem após ~2s
      setTimeout(() => {
        const result = Math.random() < 0.55 ? "win" : "loss";
        const payout = 0.8; // 80%
        if (result === "win") {
          const profit = valor * payout;
          state.orders[id] = { status: "closed", win: "win", profit, stake: valor };
          state.balances[balanceType] += valor + profit;
        } else {
          state.orders[id] = { status: "closed", win: "loss", profit: -valor, stake: valor };
          // já debitado no momento da compra
        }
      }, 2000);

      return { success: true, order_id: id };
    },
    async getOrder(order_id) {
      return state.orders[order_id] || null;
    },
    async getCandles({ ativo, periodo, quantidade }) {
      const now = Math.floor(Date.now() / 1000);
      const candles = Array.from({ length: quantidade }, (_, i) => {
        const t = now - i * periodo;
        const base = 1.1000 + Math.sin(i / 3) * 0.001;
        const open = +(base + (Math.random() - 0.5) * 0.0005).toFixed(5);
        const close = +(base + (Math.random() - 0.5) * 0.0005).toFixed(5);
        const high = +Math.max(open, close, base + 0.0007).toFixed(5);
        const low = +Math.min(open, close, base - 0.0007).toFixed(5);
        const volume = Math.floor(50 + Math.random() * 200);
        return { timestamp: t, open, close, high, low, volume };
      });
      return candles.reverse();
    }
  };
}

/*
=========================
 COMO PLUGAR A INTEGRAÇÃO REAL
=========================
1) Guarde SSID/credenciais em variáveis de ambiente (.env).
2) Aqui dentro, em vez de retornar mocks, abra uma conexão WebSocket com a plataforma
   e implemente os métodos:
   - getBalance()
   - buy({ valor, ativo, direcao, expiracao })
   - getOrder(order_id)
   - getCandles({ ativo, periodo, quantidade })

3) O resto do projeto (rotas, server, deploy) NÃO muda.
*/
