const Discord = require('discord.js');
const fs = require("fs");

var totalcount

function givelist(){
    const readdb = fs.readdirSync('./data/movies/').filter(file => file.endsWith('pics.json'))
    const listarray = [];
    totalcount = 0;
    for (var file of readdb){
        var movie = file.split('-').join(' ').replace("_pics.json", "")
        var selectedFile = JSON.parse(fs.readFileSync(`./data/movies/${file}`, 'utf8'))
        listarray.push(`- \`${movie.charAt(0).toUpperCase() + movie.slice(1)}\` (${selectedFile.length} pictures)`)
        totalcount = totalcount + selectedFile.length
    }
    listarray.push(`\nTotal pictures found: ${totalcount}`)
    return listarray.join("\n")
}

function picture(message, client, prefix, functiondate, functiontime, getlogchannel, cooldowns){
    if(message.content.startsWith(prefix + "picture")){
        try {
            //Implement cooldown
    if (!cooldowns.has(prefix + 'picture')) {
        cooldowns.set(prefix + 'picture', new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(prefix + 'picture');
    const cooldownAmount = 15000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            let totalSeconds = (expirationTime - now) / 1000;
            let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;
            return message.reply('Please wait again ' + minutes + ' minutes and ' + seconds + ' seconds before seeing a new picture of your movie.').then(m=>{m.delete(10000) ; message.delete(10000)})
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


    if (message.member.roles.find(r => r.name === "KEY (The Guiding Lanterns)")) { //Override cooldown
        timestamps.delete(message.author.id);
    }
    // End of cooldown implement
        let args = message.content.split(" ")
        args.shift()
        if (args.length < 1 || args[0] === 'list') {
            let listembed = new Discord.RichEmbed()
            listembed.setColor("#0567DA")
                .addField("Avialble movies are:", givelist())
                .setFooter(`Usage: ${prefix}picture <movie>`)
            return message.channel.send(listembed)
        }
        var picsfile = `./data/movies/${args.join("-").toLowerCase()}_pics.json`
        fs.readFile(picsfile, "utf8",function read(err, data){
            if (err) return message.channel.send("Hmm... I don't found the movie. *Maybe it was eaten, I don't know...*")
            
            var pics = JSON.parse(data);
            let random = Math.floor(Math.random() * pics.length)

            let embed = new Discord.RichEmbed;
            embed.setAuthor(`No image? Click here!`, message.author.displayAvatarURL, pics[random])
            .setImage(pics[random])
            .setColor('RANDOM')
            .setFooter(`Picture ${random + 1}/${pics.length} | If you want to add your own picture, type ${prefix}addpicture`, message.author.displayAvatarURL)
            
             message.channel.send(embed)
        })
        } catch(err) {
            message.reply('Hmm... Something went wrong. Don\'t worry, the report has been send!');
            const errmsg = `Random Tangled Picture request error: ${err}`;
            console.log(`[${functiondate(0)} - ${functiontime(0)}] ${errmsg}`);
            getlogchannel.send(errmsg);
        }
    }

    
    if (message.content.startsWith(prefix + "addpicture")){
        try {
        const args = message.content.split(/ +/).slice(1);
        
        const usage = `Usage:\`\`\`${prefix}addpicture <movie> <URL or attachment>\`\`\`If your movie name contains spaces, do a " \`-\` " instread of spaces.\n\nURLs must ends with:\`\`\`.jpg\n.jpeg\n.png\n.gif\`\`\`If you have a picture on your device, use \`${prefix}geturl\` and follow the instructions for get your URL of your image`
        if (!args[0]) return message.react('❌').then(message.reply(usage));
        
        if (args[0].endsWith('.jpg') || args[0].endsWith('.png') || args[0].endsWith('.gif') ||  args[0].endsWith('.jpeg')){
            if (!args[1]) return message.react('❌')
            .then(message.reply(`I need the movie name!\n${usage}`));
            else return message.react('❌')
            .then(message.reply(`The movie name must be set before!\n${usage}`));
        }
        if (!args[1]){
            // Check if there has an attachment
            if (message.attachments.size > 0) {
                let attachurl = message.attachments.array()[0].url
                if (message.attachments.array()[0].width > 0 && message.attachments.array()[0].height > 0) args[1] = attachurl
                else return message.react('❌')
                .then(message.reply(`Your file is not a image!\n${usage}`));
            } else {
                return message.react('❌')
                    .then(message.reply(`Please set an URL or send an image with this command\n${usage}`));
            }
        }
        if (args[1].endsWith('.jpg') || args[1].endsWith('.png') || args[1].endsWith('.gif') ||  args[1].endsWith('.jpeg')){
        if (message.member.roles.find(r=>r.id === '611908442944176140')) {
            var picsfile = `./data/movies/${args[0].toLowerCase()}_pics.json`
            var pictures = JSON.parse(fs.readFileSync(picsfile, 'utf8'))
            pictures.push(args[1]);
            picsread = JSON.stringify(pictures);
            fs.writeFileSync(picsfile, picsread);
            message.react('✅')
        } else {
            const requestchannel = client.guilds.get('570024448371982373').channels.get('603649742441938944')

            let embed = new Discord.RichEmbed;
            embed.setAuthor(`New request sent by ${message.author.tag}.\nMovie: ${args[0].charAt(0).toUpperCase() + args[0].slice(1)}`, message.author.displayAvatarURL, args[1])
                .setImage(args[1])
                .setColor('RANDOM')
                .setFooter(`User ID: ${message.author.id}`)

            requestchannel.send('<@&611908442944176140>').then(m=>requestchannel.send(embed))
            .then(m=>message.reply('✅ Your picture was requested!'))
            .catch(err=>message.reply('Error ¯\\_(ツ)_/¯\nTry again!'))
        }
        } else message.react('❌').then(message.reply('Sorry, URLs must ends with:\`\`\`.jpg\n.jpeg\n.png\n.gif\`\`\`'));;
        } catch(err) {
            message.reply('Hmm... Something went wrong. Don\'t worry, the report has been send!');
            const errmsg = `New Picture request error: ${err}`;
            console.log(`[${functiondate(0)} - ${functiontime(0)}] ${errmsg}`);
            getlogchannel.send(errmsg);
        }
    }
}

module.exports = picture;
