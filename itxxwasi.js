require('dotenv').config();
const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

let server = require('./wasiqr.js'),
    code = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

app.use('/wasiqr', server);
app.use('/code', code);
app.use('/pair', async (req, res, next) => {
    res.sendFile(__path + '/pair.html')
})
app.use('/', async (req, res, next) => {
    res.sendFile(__path + '/wasipage.html')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║           BONGOSEC BOT                ║
║        Session Generator              ║
╚═══════════════════════════════════════╝

🌐 Server running on: http://localhost:${PORT}
📞 Bot Number: ${process.env.BOT_PHONE_NUMBER || 'Not set in .env'}

📱 Available Routes:
   • /          - Main page
   • /pair      - Web pairing interface
   • /wasiqr    - QR code generator
   • /code      - API pairing endpoint

💡 To generate pairing code in console:
   Run: npm run autopair

⭐ Don't forget to give star to the repo!
    `);
});

module.exports = app;
