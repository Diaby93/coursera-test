
console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body || '{}');
    console.log("Parsed data:", data);

    // Check if items array exists
    if (!Array.isArray(data.cart)) {
      throw new Error("Request body must include an 'items' array.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: data.cart.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // price in cents
        },
        quantity: item.quantity,
      })),
      success_url: 'https://getfreshjuice.com/success',
      cancel_url: 'https://getfreshjuice.com/cancel',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Checkout session error:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
