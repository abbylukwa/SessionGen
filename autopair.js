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
        console.log('❌ No BOT_PHONE_NUMBER found in .env file');
        return;
    }

    const id = makeid();
    const num = process.env.BOT_PHONE_NUMBER.replace(/[^0-9]/g, '');
    
    console.log('\n🎯 BONGOSEC AUTO-PAIRING SYSTEM');
    console.log('📞 Phone Number:', `+${num}`);
    console.log('⏳ Generating pairing code...\n');

    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

    try {
        let Pair_Code_By_Gifted_Tech = Gifted_Tech({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            browser: ["Chrome (Linux)", "", ""]
        });

        if (!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
            await delay(1500);
            
            const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num);
            
            console.log('='.repeat(50));
            console.log('🚀 **PAIRING CODE GENERATED SUCCESSFULLY!**');
            console.log('='.repeat(50));
            console.log('📱 Phone: +' + num);
            console.log('🔢 Pairing Code:', code);
            console.log('='.repeat(50));
            console.log('💡 Instructions:');
            console.log('1. Open WhatsApp on your phone');
            console.log('2. Go to Settings → Linked Devices → Link a Device');
            console.log('3. Enter this code: ' + code);
            console.log('='.repeat(50));
            console.log('⏰ Code expires in 20 seconds!');
            console.log('='.repeat(50));

            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds);
            
            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection == "open") {
                    console.log('\n✅ **WHATSAPP CONNECTED SUCCESSFULLY!**\n');
                    
                    await delay(3000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    let b64data = Buffer.from(data).toString('base64');
                    
                    console.log('📦 Session Credentials Saved!');
                    console.log('🔐 Session ID (base64):', b64data.substring(0, 50) + '...');
                    console.log('\n🎉 Your bot is now ready to use!');
                    
                    await delay(1000);
                    await Pair_Code_By_Gifted_Tech.ws.close();
                    
                    // Cleanup
                    if (fs.existsSync('./temp/' + id)) {
                        fs.rmSync('./temp/' + id, { recursive: true, force: true });
                    }
                    
                    console.log('🧹 Temporary files cleaned up.');
                    process.exit(0);
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    console.log('❌ Connection closed, restarting...');
                    await delay(10000);
                    autoPair();
                }
            });
        }
    } catch (err) {
        console.log('❌ Error:', err.message);
        // Cleanup on error
        if (fs.existsSync('./temp/' + id)) {
            fs.rmSync('./temp/' + id, { recursive: true, force: true });
        }
        process.exit(1);
    }
}

// Run auto-pairing if this file is executed directly
if (require.main === module) {
    autoPair();
}

module.exports = autoPair;
