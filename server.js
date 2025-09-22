{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import express from "express";\
import Stripe from "stripe";\
\
const app = express();\
app.use(express.json());\
\
// Stripe secret key (set in Vercel later)\
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);\
\
// \uc0\u9989  Change these values\
const MIN_PHP = 50;\
const MAX_PHP = 5000;\
const DOMAIN = process.env.DOMAIN || "https://your-ghl-funnel.com";\
\
app.post("/create-checkout-session", async (req, res) => \{\
  try \{\
    const amountPhp = Number(req.body.amount || 0);\
    if (!Number.isFinite(amountPhp) || amountPhp < MIN_PHP || amountPhp > MAX_PHP) \{\
      return res.status(400).json(\{ error: "Invalid amount" \});\
    \}\
\
    const amountCentavos = Math.round(amountPhp * 100);\
\
    const session = await stripe.checkout.sessions.create(\{\
      payment_method_types: ["card"],\
      line_items: [\{\
        price_data: \{\
          currency: "php",\
          product_data: \{ name: "Custom Payment" \},\
          unit_amount: amountCentavos\
        \},\
        quantity: 1\
      \}],\
      mode: "payment",\
      success_url: `$\{DOMAIN\}/success?session_id=\{CHECKOUT_SESSION_ID\}`,\
      cancel_url: `$\{DOMAIN\}/cancel`\
    \});\
\
    res.json(\{ sessionId: session.id \});\
  \} catch (err) \{\
    console.error(err);\
    res.status(500).json(\{ error: "Server error" \});\
  \}\
\});\
\
if (process.env.VERCEL === undefined) \{\
  const port = 3000;\
  app.listen(port, () => console.log(`Server running on port $\{port\}`));\
\}\
\
export default app;\
}