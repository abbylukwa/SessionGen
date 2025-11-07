const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL')
const {makeid} = require('./id');
const express = require('express');
const fs = require('fs');
require('dotenv').config(); // ADD THIS LINE
let router = express.Router()
const pino = require("pino");
const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath){
    if(!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true })
 };

router.get('/', async (req, res) => {
    const id = makeid();
    // MODIFY THIS LINE - Use .env first, then fallback to query parameter
    let num = process.env.BOT_PHONE_NUMBER || req.query.number;
    
    async function GIFTED_MD_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/'+id)
     try {
            let Pair_Code_By_Gifted_Tech = Gifted_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({level: "fatal"}).child({level: "fatal"})),
                },
                printQRInTerminal: false,
                logger: pino({level: "fatal"}).child({level: "fatal"}),
                browser: ["Chrome (Linux)", "", ""]
             });
             
             if(!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
                await delay(1500);
                // MODIFY THIS SECTION - Auto-use the .env number
                if (process.env.BOT_PHONE_NUMBER) {
                    num = process.env.BOT_PHONE_NUMBER.replace(/[^0-9]/g,'');
                } else {
                    num = num.replace(/[^0-9]/g,'');
                }
                
                const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num)
                
                if(!res.headersSent){
                    // If using .env number, send auto-response
                    if (process.env.BOT_PHONE_NUMBER) {
                        await res.send({
                            code: code,
                            message: `Pairing code generated for: ${process.env.BOT_PHONE_NUMBER}`,
                            auto_generated: true
                        });
                    } else {
                        await res.send({code: code});
                    }
                }
             }
             
            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds)
            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const {
                    connection,
                    lastDisconnect
                } = s;
                
                if (connection == "open") {
                await delay(5000);
                let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                await delay(800);
               let b64data = Buffer.from(data).toString('base64');
               let session = await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: '' + b64data });

               let GIFTED_MD_TEXT = `
*_Session Connected By MrpasswordTz_*
*_Made With ❤️_*
______________________________________
┌─────⭓
│ *【AMAZING YOU'VE CHOSEN Bongosec】*
│ _You Have Completed the First Step to Deploy a Whatsapp Bot._
└─────────────────────⭓
┌─────⭓
│  【••• 🎉🎊🎇 🎈🎂 🎁 •••】
│➤ *Ytube:* _youtube.com/@Bongosec
│➤ *Owner:* _https://wa.me/message/4LCPZQQUEJCFI1_
│➤ *Repo:* _https://github.com/MrpasswordTz/SessionGen_
│➤ *WaGroup:* _https://chat.whatsapp.com/KSBRkjltMnr72hnZb0WI3f_
│➤ *WaChannel:* _https://whatsapp.com/channel/0029Vb0hbtm8KMqcBV8T2Z2Y_
│➤ *Plugins:* _https://github.com/bongosec
└─────────────────────⭓
_____________________________________
	
_Don't Forget To Give Star To My Repo_`
 
                await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id,{text:GIFTED_MD_TEXT},{quoted:session})
 
                await delay(100);
                await Pair_Code_By_Gifted_Tech.ws.close();
                return await removeFile('./temp/'+id);
                
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restated");
            await removeFile('./temp/'+id);
         if(!res.headersSent){
            await res.send({code:"Service Unavailable"});
         }
        }
    }
    return await GIFTED_MD_PAIR_CODE()
});

module.exports = router
