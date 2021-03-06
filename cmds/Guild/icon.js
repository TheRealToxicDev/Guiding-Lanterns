const Discord = require('discord.js')
const fs = require('fs')

function servericon(message, client, prefix, cooldowns){
    if(message.content.startsWith(prefix + 'randomicon')){
        try{
        //Implement cooldown
        if (!cooldowns.has(prefix + 'randomicon')) {
            cooldowns.set(prefix + 'randomicon', new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(prefix + 'randomicon');
        const cooldownAmount = 4 * 60 * 60 * 1000; // 4 hours cooldown

        if (timestamps.has(message.guild.id)) {
            const expirationTime = timestamps.get(message.guild.id) + cooldownAmount;

            if (now < expirationTime) {
                let totalSeconds = (expirationTime - now) / 1000;
                let days = Math.floor(totalSeconds / 86400);
                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = totalSeconds % 60;
                return message.reply(`please wait ${hours.toFixed(0)} hour(s), ${minutes.toFixed(0)} minute(s) and ${seconds.toFixed(0)} second(s) before reusing the \`${prefix+'randomicon'}\` command.`)
            }
        }

        timestamps.set(message.guild.id, now);
        setTimeout(() => timestamps.delete(message.guild.id), cooldownAmount);


        if (message.member.roles.find(r => r.name === "KEY (The Guiding Lanterns)")) { //Override cooldown
            timestamps.delete(message.guild.id);
        }
        // End of cooldown implement

        function randomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        }

        var picsfile = [
            `./data/movies/tangled_pics.json`,
            `./data/movies/tangled_fanarts.json`
        ]
        let rfile = randomItem(picsfile)
        fs.readFile(rfile, "utf8",function read(err, data){
            if (err) return message.channel.send("Whoops, there are an error")
        
            var pics = JSON.parse(data);
            let pic = randomItem(pics)

            message.guild.setIcon(pic).catch(err=>message.channel.send("Whoops, there are an error"))

            let embed = new Discord.RichEmbed;
            embed.setTitle('New server icon set randomly')
            .setImage(pic)
            .setColor('RANDOM')
            .setFooter(`New picture set by ${message.author.tag}`)
        
            message.channel.send(embed)
        })
    } catch(err){
        message.channel.send("Whoops, there are an error")
    }
    }
}

module.exports = servericon