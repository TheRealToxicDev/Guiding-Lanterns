const Discord = require('discord.js')
const Enmap = require('enmap')
const fs = require('fs');
const supportfile = './data/support_db.json'

function claim(message, client, prefix, cooldowns, dbl, cur_json, lang){
    if(message.content.startsWith(prefix + "claim") || message.content.startsWith(prefix + "daily")) {

        //Implement cooldown
        if (!cooldowns.has(prefix + 'claim')) {
            cooldowns.set(prefix + 'claim', new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(prefix + 'claim');
        const cooldownAmount = 24 * 60 * 60 * 1000; // 24 hours cooldown

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                let totalSeconds = (expirationTime - now) / 1000;
                let days = Math.floor(totalSeconds / 86400);
                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = totalSeconds % 60;
                return message.reply(`please wait ${hours.toFixed(0)} hour(s), ${minutes.toFixed(0)} minute(s) and ${seconds.toFixed(0)} second(s) before reusing the \`${prefix+'claim'}\` command.`)
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


        if (message.author.id === '330030648456642562') { //Override cooldown
            timestamps.delete(message.author.id);
        }
        // End of cooldown implement

        const support_db = JSON.parse(fs.readFileSync(supportfile, "utf8"))
        const donor = support_db[message.author.id]

        const bal = new Enmap({name:"cur_balance"})

        let embed = new Discord.RichEmbed
        embed.setTitle(cur_json.name[1])
        .setColor('RANDOM')

        if (!bal.has(message.author.id)) bal.set(message.author.id, 0)
        
        if (dbl === undefined){
            if (!donor){
                bal.set(message.author.id, bal.get(message.author.id) + 100)
                embed.setDescription(lang.claim_normal.replace('${money}', `100 ${cur_json.cur.symbol}`))
            } else if (donor) {
                bal.set(message.author.id, bal.get(message.author.id) + 200)
                embed.setDescription(lang.claim_support.replace('${money}', `200 ${cur_json.cur.symbol}`))
            }
            message.channel.send(embed);
        } else {
            dbl.hasVoted(message.author.id).then(voted => {
                if (voted) {
                    if (!donor){
                        bal.set(message.author.id, bal.get(message.author.id) + 200)
                        embed.setDescription(lang.claim_vote1.replace('${money1}', `200 ${cur_json.cur.symbol}`).replace('${money2}', `100 ${cur_json.cur.symbol}`))
                        embed.setFooter(lang.claim_thanks_vote)
                    } else if (donor){
                        bal.set(message.author.id, bal.get(message.author.id) + 500)
                        embed.setDescription(lang.claim_vote2.replace('${money1}', `500 ${cur_json.cur.symbol}`).replace('${money2}', `400 ${cur_json.cur.symbol}`))
                        embed.setFooter(lang.claim_thanks_support)
                    }
                } else {
                    if (!donor){
                        bal.set(message.author.id, bal.get(message.author.id) + 100)
                        embed.setDescription(lang.claim_normal.replace('${money}', `100 ${cur_json.cur.symbol}`))
                        embed.setFooter(lang.claim_tip)
                    } else if (donor) {
                        bal.set(message.author.id, bal.get(message.author.id) + 400)
                        embed.setDescription(lang.claim_support.replace('${money}', `400 ${cur_json.cur.symbol}`))
                        embed.setFooter(lang.claim_tip)
                    }
                }
                message.channel.send(embed);
            })
        }
    }
}

module.exports = claim