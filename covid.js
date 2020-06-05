const {
    Client,
    MessageEmbed
} = require('discord.js');
const fetch = require('node-fetch');
const auth = require('./auth.json');
const countryJson = require('./countries.json');

//  Parse Json
var stringifyCountry = JSON.stringify(countryJson)
var parseCountry = JSON.parse(stringifyCountry)
var listCountry = ""
for (let [key, value] of Object.entries(parseCountry)) {
    listCountry += `${key} -> ${value}\n`
}

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
  
    var talipChannel = client.channels.cache.find(channel => channel.id === '706463146029875302')
    var darkChannel = client.channels.cache.find(channel => channel.id === '700350409969238069')
    var rhesienChannel = client.channels.cache.find(channel => channel.id === '710092561666277399')

    setInterval(() => {
        talipChannel.send("**Black Lives Matter**")
        darkChannel.send("**Black Lives Matter")
        rhesienChannel.send("**Black Lives Matter")
    }, 3600000);
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
                }).catch(err => console.log(err))
/*         } else if (country === 'yardım') {
            const help = new MessageEmbed()
                .setTitle("Covid19")
                .setDescription(`Verileri görebilmek için !covidülkeismi şeklinde giriş yapmalısınız.\n${listCountry}`)
            message.channel.send(help) */
        } else if (tempCountry === undefined) {;
            message.channel.send('Düzgün yaz şunu mübarek');
        }
    }
});

client.login(process.env.TOKEN);