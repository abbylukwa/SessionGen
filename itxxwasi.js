require('dotenv').config();
const express = require('express');
const app = express();
__path = process.cwd()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

let server = require('./wasiqr.js'),
    code = require('./pair');
    
// Import the auto-pair function
const autoPair = require('./autopair');

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

// Start the server
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

🚀 Starting auto-pairing process...
    `);
    
    // Auto-start the pairing process
    if (process.env.BOT_PHONE_NUMBER) {
        console.log('⏳ Initializing auto-pairing for: ' + process.env.BOT_PHONE_NUMBER);
        setTimeout(() => {
            autoPair().catch(err => {
                console.log('❌ Auto-pairing failed:', err.message);
            });
        }, 2000);
    } else {
        console.log('❌ No BOT_PHONE_NUMBER set in environment variables');
        console.log('💡 Please set BOT_PHONE_NUMBER in your .env file or Railway variables');
    }
});

module.exports = app;
