require('dotenv').config();
const express = require('express');
const app = express();

// مسیر اصلی
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// مسیر محافظت‌شده
app.get('/secret', (req, res) => {
  const auth = req.headers.authorization;

  // اگر هیچ headerی وجود نداشت => مرورگر باید popup باز کنه
  if (!auth) {
    res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
    return res.status(401).send('Authentication required');
  }

  // تجزیه‌ی header
  const base64 = auth.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString().split(':');

  // بررسی نام کاربری و رمز
  if (user === process.env.APP_USER && pass === process.env.PASSWORD) {
    res.send(process.env.SECRET_MESSAGE);
  } else {
    res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
    res.status(401).send('Invalid credentials');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
