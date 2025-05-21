const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { quantity, color } = JSON.parse(event.body);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `FRESH JUICE Portable Blender (${color})`,
            },
            unit_amount: 2999, // £29.99 in pence
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: 'https://getfreshjuice.com/success',
      cancel_url: 'https://getfreshjuice.com/cancel',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
