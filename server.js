import express from "express";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount range
    if (amount < 22 || amount > 222) {
      return res.status(400).json({ error: "Amount must be between $22 and $222" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Custom Amount" },
            unit_amount: amount * 100, // convert dollars → cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Export for Vercel
export default app;
