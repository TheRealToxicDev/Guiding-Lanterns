const Discord = require('discord.js');
const fs = require('fs');
const packagefile = "./package.json";
const package = JSON.parse(fs.readFileSync(packagefile, "utf8"));

function message_count(client, channel_id) {
    const channel = client.channels.get(channel_id);
    if (!channel) {
        console.log(`Channel: ${channel_id} cannot be found`);
        return;
    }

    channel.setName(`Version ${package.version}`).catch(err=>console.log(err));

}

module.exports = message_count;