const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  const { email, name } = JSON.parse(event.body);

  try {
    const data = await resend.emails.send({
      from: 'Fresh Juice <orders@getfreshjuice.com>',
      to: email,
      subject: `Thanks for your order, ${name}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 12px;">
            <h1 style="color: #e44b11;">Thank you, ${name}!</h1>
            <p style="font-size: 16px;">We’ve received your order for the <strong>Fresh Juice Portable Blender</strong>.</p>
            <img src="https://www.getfreshjuice.com/images/new-pink.jpeg" style="width: 100%; max-width: 300px; border-radius: 10px;" />
            <p style="font-size: 15px; margin-top: 20px;">You’ll receive tracking details once it ships.</p>
            <a href="https://www.getfreshjuice.com" style="background: #e44b11; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px;">Track My Order</a>
          </div>
        </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
