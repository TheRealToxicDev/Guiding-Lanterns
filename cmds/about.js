const Discord = require('discord.js');

function about(message, client, prefix) {
    const UpTime = (Math.round(client.uptime / (1000 * 60 * 60 * 24))) + "days, " + (Math.round(client.uptime / (1000 * 60 * 60)) % 24) + " hours, " + (Math.round(client.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(client.uptime / 1000) % 60) + " seconds";
    if (message.content.startsWith(prefix + 'about')) {
        let embed = new Discord.RichEmbed()
        embed.setColor("#9C01C4")
            .setTitle(client.user.tag)
            .addField("Cast:", `- **Greep#3022** : Original idea\n- **Ajam#3536** : Contributor`, true)
            .addField("Technical information", `Libary used: [Discord.js](https://discord.js.org)\nDelay between bot and Discord server: ${Math.round(client.ping)} ms\nRAM used: ${Math.round(process.memoryUsage().rss / 1024 / 1000)} MB\nUptime: ${UpTime}`)
            .addField("Useful links:", `[**Kingdom of Corona ☀**](https://discord.gg/BunQeKh)\n[Bot source code on GitHub](https://github.com/GreepTheSheep/Guiding-Lanterns)\n[Developement server](https://discord.gg/5QCQpr9)\n[Support the bot on Patreon](https://www.patreon.com/GuidingLanterns)`, true)
            .setThumbnail(`${client.user.avatarURL}`)
            .setFooter(`${client.user.username}`, `${client.user.avatarURL}`)
        message.channel.send(embed)
    }
}

module.exports = about;