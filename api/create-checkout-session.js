import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { amount } = req.body;

  if (!amount || amount < 10) {
    return res.status(400).json({ error: "Monto inválido" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Pago MLASTUDIO",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: "https://mlastdio.com/ProfileX/MikkelAlonso/Pagos/success.php",
      cancel_url: "https://mlastdio.com/ProfileX/MikkelAlonso/Pagos/cancel.php",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: "Stripe error" });
  }
}
