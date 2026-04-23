# Renova Menu PWA — Cardápio Digital

Demo funcional do frontend cliente (PWA) para a plataforma SaaS **Cardápio Digital**, construído para apresentação ao cliente *Frita & Fino — Salgaderia Artesanal*.

> Escopo desta demo: **somente o app do cliente final** (quem escaneia o QR Code na mesa). O backend e o painel administrativo estão especificados no documento técnico (`Documento-Tecnico-Cardapio-Digital-SaaS.docx`), mas não são parte desta entrega de código.

---

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS 3.4** com paleta personalizada (tons quentes / salgados fritos)
- **Zustand** para estado global (carrinho persistido em localStorage)
- **Framer Motion** para animações e transições
- **Lucide React** para ícones
- **PWA** — `manifest.json`, theme color e viewport configurados

Preparado para rodar local (`npm run dev`) e para ser empacotado como PWA instalável.

---

## Estrutura de telas

Rota base multi-tenant: `/r/[slug]` (nesta demo, o slug configurado é `frita-fino`).

```
/r/frita-fino                         → Home do cardápio (categorias, destaques, populares)
/r/frita-fino/product/[productId]     → Detalhe do produto (modificadores, observações)
/r/frita-fino/cart                    → Carrinho (cupom, gorjeta, resumo)
/r/frita-fino/checkout                → Pagamento (PIX / Cartão / Carteira / Caixa)
/r/frita-fino/order?n=XXXX            → Acompanhamento do pedido (timeline)
/r/frita-fino/loyalty                 → Programa de fidelidade (pontos, cashback, recompensas)
/r/frita-fino/queue                   → Fila de espera + reserva de mesa
```

Navegação inferior (`BottomNav`) persistente em todas as telas, com badge contador de itens no carrinho. Botão flutuante **"Chamar garçom"** disponível em todas as telas (exceto no checkout).

---

## Funcionalidades implementadas

- Cardápio com categorias, destaques horizontais, "mais pedidos" e seções por categoria
- Imagens de produtos via Unsplash (configuradas em `next.config.js`)
- Detalhe de produto com **modificadores** (grupos obrigatórios/opcionais, min/max), observações, stepper de quantidade
- Carrinho persistente (Zustand + localStorage) com:
  - Ajuste de quantidade inline
  - Remoção com animação (Framer Motion)
  - **Cupons** (`BEMVINDO10`, `FRITANA20`)
  - Seleção de **gorjeta** (0 / 5 / 10 / 15%)
  - Resumo com subtotal, taxa de serviço, gorjeta, desconto, total
- Checkout com 4 métodos de pagamento:
  - **PIX** com QR Code animado, copia-e-cola e timer de expiração
  - **Cartão** (fluxo simulado)
  - **Carteira digital** (Apple/Google Pay — simulado)
  - **Pagar no caixa**
- Página de pedido com **timeline animada** (Recebido → Preparando → Pronto → Entregue)
- Fidelidade: nível Ouro, barra de progresso, cashback, recompensas resgatáveis, código de indicação, histórico
- Fila de espera com **posição ao vivo** (simulada) e reserva de mesa com escolha de data, horário, ocasião

---

## Como rodar

Requer **Node.js 18.17+** (ou 20+).

```bash
cd renova-menu-pwa
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) e será redirecionado para `/r/frita-fino`.

Para build de produção:

```bash
npm run build
npm run start
```

### Testar como PWA no celular

1. Rode `npm run dev -- -H 0.0.0.0`
2. Descubra o IP local da sua máquina (`ifconfig` / `ipconfig`)
3. No celular, acesse `http://<seu-ip>:3000/r/frita-fino`
4. No Chrome mobile: menu → "Adicionar à tela inicial"

---

## Estrutura de pastas

```
renova-menu-pwa/
├── app/
│   ├── layout.tsx                    # shell global + fonts + PWA manifest
│   ├── page.tsx                      # redireciona para /r/frita-fino
│   ├── globals.css
│   └── r/[slug]/
│       ├── layout.tsx                # BottomNav + FloatingCart + WaiterFab
│       ├── page.tsx                  # Home
│       ├── product/[productId]/page.tsx
│       ├── cart/page.tsx
│       ├── checkout/page.tsx
│       ├── order/page.tsx
│       ├── loyalty/page.tsx
│       └── queue/page.tsx
├── components/
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   ├── CategoryChips.tsx
│   ├── ProductCard.tsx
│   ├── FloatingCart.tsx
│   └── WaiterFab.tsx
├── lib/
│   ├── types.ts                      # tipos TS do domínio
│   ├── mock-data.ts                  # dados do restaurante + produtos
│   ├── cart-store.ts                 # Zustand + persist
│   └── utils.ts                      # cn() + formatBRL()
├── public/
│   ├── manifest.json
│   └── icons/ (192px, 512px, favicon)
├── tailwind.config.ts                # paleta + animações customizadas
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Paleta de cores

| Token | Hex | Uso |
|-------|------|-----|
| `brand` | `#B93C10` | Vermelho terra (óleo quente, salgados) |
| `brand-700` | `#8E2D0C` | CTAs pressionados, gradientes |
| `brand-900` | `#4A1605` | Títulos |
| `accent` | `#FFB020` | Dourado (salgado frito, fidelidade) |
| `cream-50` | `#FFFBF5` | Fundo geral |
| `cream-200` | `#F3E9DA` | Bordas suaves |

Tipografia: **Inter** (texto) + **Playfair Display** (títulos / display), via `next/font/google`.

---

## Próximos passos (pós-demo)

Para virar produto real, a partir desta base:

1. Substituir `lib/mock-data.ts` por chamadas ao backend (`/api/restaurants/[slug]`, `/api/menu`)
2. Integrar gateway de pagamento real (Mercado Pago, Stone, Cielo) no `checkout/page.tsx`
3. Substituir a timeline simulada do pedido por WebSocket/SSE conectado ao backend
4. Implementar i18n (pt-BR padrão, en-US/es-ES opcionais)
5. Adicionar autenticação leve (telefone + OTP via WhatsApp) para fidelidade e histórico
6. Integrar com PDV / ERP (Colibri, Consumer, Saipos) via webhook de pedido

Veja o documento `Documento-Tecnico-Cardapio-Digital-SaaS.docx` para a arquitetura completa.

---

**Cliente:** Frita & Fino — Salgaderia Artesanal
**Demo construída por:** RenovaCom Criativo · 2026
