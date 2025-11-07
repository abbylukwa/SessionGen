require('dotenv').config();
const fs = require('fs');
const pino = require("pino");
const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

const { makeid } = require('./id');

async function autoPair() {
    if (!process.env.BOT_PHONE_NUMBER) {
        console.log('❌ No BOT_PHONE_NUMBER found in environment variables');
        console.log('💡 Please set BOT_PHONE_NUMBER=263777627210 in your .env file or Railway variables');
        return;
    }

    const id = makeid();
    const num = process.env.BOT_PHONE_NUMBER.replace(/[^0-9]/g, '');
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 BONGOSEC AUTO-PAIRING SYSTEM');
    console.log('='.repeat(60));
    console.log('📞 Phone Number: +' + num);
    console.log('⏳ Generating pairing code...\n');

    // Create temp directory if it doesn't exist
    if (!fs.existsSync('./temp')) {
        fs.mkdirSync('./temp', { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

    try {
        let Pair_Code_By_Gifted_Tech = Gifted_Tech({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            browser: ["Ubuntu", "Chrome", "20.0.04"]
        });

        if (!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
            await delay(2000);
            
            console.log('📡 Requesting pairing code from WhatsApp...');
            const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num);
            
            console.log('\n' + '='.repeat(60));
            console.log('🚀 **PAIRING CODE GENERATED SUCCESSFULLY!**');
            console.log('='.repeat(60));
            console.log('📱 Phone: +' + num);
            console.log('🔢 **Pairing Code: ' + code + '**');
            console.log('='.repeat(60));
            console.log('💡 **Instructions:**');
            console.log('1. Open WhatsApp on your phone');
            console.log('2. Go to Settings → Linked Devices → Link a Device');
            console.log('3. Enter this code: ' + code);
            console.log('='.repeat(60));
            console.log('⏰ Code expires in 20 seconds!');
            console.log('='.repeat(60) + '\n');

            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds);
            
            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection == "open") {
                    console.log('\n✅ **WHATSAPP CONNECTED SUCCESSFULLY!**\n');
                    
                    await delay(3000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let b64data = Buffer.from(data).toString('base64');
                    
                    console.log('📦 Session Credentials Saved!');
                    console.log('🔐 Session ID (base64):', b64data);
                    console.log('\n🎉 Your bot is now ready to use!');
                    console.log('💾 Session has been saved automatically.');
                    
                    // Send session to user via message
                    try {
                        let session = await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: b64data });
                        
                        let successMessage = `
*_Session Connected By BongoSec_* ✅
*_Made With ❤️_*

🤖 *Bot Successfully Connected!*
📞 Phone: +${num}
🆔 Session ID saved automatically

🔗 *Important Links:*
• YouTube: youtube.com/@Bongosec
• Owner: wa.me/+255652181995
• Repo: github.com/MrpasswordTz
• Group: chat.whatsapp.com/KSBRkjltMnr72hnZb0WI3f

_Don't Forget To Give Star To Our Repo_ ⭐`;

                        await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: successMessage }, { quoted: session });
                    } catch (msgErr) {
                        console.log('💬 Message sent to bot owner');
                    }
                    
                    await delay(2000);
                    await Pair_Code_By_Gifted_Tech.ws.close();
                    
                    // Cleanup
                    if (fs.existsSync('./temp/' + id)) {
                        fs.rmSync('./temp/' + id, { recursive: true, force: true });
                    }
                    
                    console.log('🧹 Temporary files cleaned up.');
                    console.log('\n' + '='.repeat(60));
                    console.log('🎊 **BOT SETUP COMPLETE!**');
                    console.log('='.repeat(60));
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    console.log('🔁 Connection closed, attempting to reconnect...');
                    await delay(10000);
                    autoPair();
                }
            });
        }
    } catch (err) {
        console.log('❌ Error during pairing:', err.message);
        // Cleanup on error
        if (fs.existsSync('./temp/' + id)) {
            fs.rmSync('./temp/' + id, { recursive: true, force: true });
        }
        // Retry after 10 seconds
        console.log('🔄 Retrying in 10 seconds...');
        setTimeout(() => {
            autoPair();
        }, 10000);
    }
}

// Run auto-pairing if this file is executed directly
if (require.main === module) {
    autoPair();
}

module.exports = autoPair;
