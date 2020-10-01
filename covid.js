const { Client, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const auth = require("./auth.json");
const countryJson = require("./countries.json");

//  Parse Json
var stringifyCountry = JSON.stringify(countryJson);
var parseCountry = JSON.parse(stringifyCountry);
var listCountry = "";
for (let [key] of Object.entries(parseCountry)) {
  listCountry += `${key}\n`;
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
client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.content.startsWith(prefix)) {
    var country = message.content.slice(prefix.length);
    tempCountry = countryJson[country];
    if (
      message.content.startsWith(prefix + country) &&
      tempCountry !== undefined
    ) {
      getData(tempCountry)
        .then((response) => {
          const embed = new MessageEmbed()
            .setThumbnail(response["countryInfo"]["flag"])
            .setTitle(response["country"])
            .setColor(0xff0000)
            .setDescription(
              `Günlük Vaka: **${response.todayCases}**
                                Günlük Vefat: **${response.todayDeaths}**
                                Kritik Vaka: **${response.critical}**
                                İyileşen: **${response.recovered}**
                                Toplam Vaka: **${response.cases}**
                                Toplam Vefat: **${response.deaths}**`
            )
            .setTimestamp(response["updated"]);
          message.channel.send(embed);
        })
        .catch((err) => console.log(err));
    } else if (country === "yardım") {
      const help = new MessageEmbed()
        .setTitle("Covid19")
        .setDescription(
          `**Verileri görebilmek için !covidülkeismi şeklinde giriş yapmalısınız**.\n${listCountry}`
        );
      message.channel.send(help);
    } else if (tempCountry === undefined) {
      message.channel.send("Düzgün yaz şunu mübarek");
    } else if (country === "belirti") {
      message.channel.send(
        "**En yaygın semptomlar**x:\n\
            ateş\n\
            kuru öksürük\n\
            yorgunluk\n\n\
            **daha seyrek görülen semptomlar**:\n\
            ağrı ve sızı\n\
            boğaz ağrısı\n\
            ishal\n\
            konjunktivit\n\
            baş ağrısı\n\
            tat alma veya koku duyusunun kaybı\n\
            ciltte döküntü ya da el veya ayak parmaklarında renk değişim\n\n\
            **Ciddi semptomlar**:\n\
            solunum güçlüğü veya nefes darlığı\n\
            göğüs ağrısı veya göğüste baskı\n\
            konuşma veya hareket kaybı\
            "
      );
    } else if (country === "önlem") {
      message.channel.send(
        "Maske tak\nEvden Çıkma\nTemastan kaçın\nSosyal mesafe\n\
            Unutmayın elimizde virüse karşı büyük bir güç var. O da yakalanmamak..."
      );
    }
  }
});

client.login(process.env.TOKEN);
