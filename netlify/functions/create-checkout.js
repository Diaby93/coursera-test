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
  shipping_address_collection: {
    allowed_countries: ['US', 'GB', 'CA', 'AU', 'NZ'],
  },
  shipping_options: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 0,
          currency: 'usd',
        },
        display_name: 'Free Shipping',
        delivery_estimate: {
          minimum: { unit: 'business_day', value: 7 },
          maximum: { unit: 'business_day', value: 14 },
        },
      },
    },
  ],
  line_items: data.cart.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  })),
  success_url: 'https://getfreshjuice.com/success',
  cancel_url: 'https://getfreshjuice.com/cancel',
});
