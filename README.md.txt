# API PocketOption 07

Backend em **Node.js + Express** com rotas para:
- `POST /saldo`
- `POST /ordem`
- `POST /resultado`
- `POST /candles`

> Por padrão, as respostas são **simuladas** (mock) para você já testar no Render.  
> Para conectar à PocketOption “de verdade”, edite **src/services/pocketOptionWS.js**.

## Rodar localmente
```bash
npm install
cp .env.example .env
npm start
