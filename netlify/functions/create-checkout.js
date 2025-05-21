const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const items = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // in pence
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
};
