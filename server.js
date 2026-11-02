import express from 'express';
import { PayGate } from 'paygate-to';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const paygate = new PayGate();

app.post('/create-payment', async (req, res) => {
  try {
    const { amount, email, orderId } = req.body;
    const callbackUrl = `${process.env.RENDER_EXTERNAL_URL || 'https://your-app.onrender.com'}/paygate/callback?order=${orderId}`;
    const wallet = await paygate.card.createWallet(process.env.POLYGON_WALLET, callbackUrl);
    const paymentUrl = paygate.card.paymentUrl(wallet, amount, email, 'USD');
    res.json({ paymentUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.get('/paygate/callback', async (req, res) => {
  console.log(`Payment confirmed: ${req.query.order}`);
  res.send('ok');
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
