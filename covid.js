const {
    Client,
    MessageEmbed
} = require('discord.js');
const fetch = require('node-fetch');
const auth = require('./auth.json');
const countryJson = require('./countries.json');


let tempCountry = null;
const prefix = process.env.prefix;


// Create an instance of a Discord client
const client = new Client();

async function getData(country) {
    const response = await fetch(process.env.url + country);
    const data = await response.json();
    return data;
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log('I am ready!');

    // 706463146029875302    
    var testChannel = client.channels.cache.find(channel => channel.id === '706463146029875302')


    setInterval(() => {
        testChannel.send("Merhaba")
    }, 10000);
});


client.on('message', message => {
    if (message.content.startsWith(prefix)) {
        var country = message.content.slice(prefix.length);
        tempCountry = countryJson[country];
        if (message.content.startsWith(prefix + country) && tempCountry !== undefined) {
            getData(tempCountry)
                .then(response => {
                    const embed = new MessageEmbed()
                        .setThumbnail(response["countryInfo"]["flag"])
                        .setTitle(response["country"])
                        .setColor(0xff0000)
                        .setDescription(`Günlük Vaka: **${response.todayCases}**
                                Günlük Vefat: **${response.todayDeaths}**
                                Kritik Vaka: **${response.critical}**
                                İyileşen: **${response.recovered}**
                                Toplam Vaka: **${response.cases}**
                                Toplam Vefat: **${response.deaths}**`)
                        .setTimestamp(response["updated"])
                    message.channel.send(embed);
                }).catch(err => console.log(err));
        } else if (tempCountry === undefined) {;
            message.channel.send('Düzgün yaz şunu mübarek');
        }
    }
});

client.login(process.env.TOKEN);