if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const SlackBot = require('slackbots');
const axios = require('axios');

const bot = new SlackBot({
  token: process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
  name: 'webpedagobot',
});

// Tell a Chuck Norris Joke
function chuckJoke() {
  axios.get('http://api.icndb.com/jokes/random')
    .then((res) => {
      const { joke } = res.data.value;

      bot.postMessageToChannel('aléatoire', joke);
    });
}

// Display the actual temperature in Paris
function displayWeather() {
  const url = encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${process.env.OPEN_WEATHER_APP_KEY}`);
  axios.get(url)
    .then((res) => {
      const temperature = parseFloat(res.data.main.temp) - 273.15;

      bot.postMessageToChannel(
        'aléatoire',
        `La température actuelle à Paris est de ${temperature.toFixed(2)}°C !`,
      );
    });
}

// Show Help Text
function runHelp() {
  bot.postMessageToChannel(
    'aléatoire',
    "Dites-moi 'météo' pour obtenir la température actuelle à Paris ou 'Chuck Norris' pour rire un petit coup.",
  );
}

// Response to Data
function handleMessage(message) {
  const messageContent = message.text;
  const messageSender = message.user;

  const greetingsRegex = /salut/i;
  const chuckNorrisRegex = /chuck ?norris/i;
  const weatherRegex = /m(é|e)t(é|e)o/i;

  if (messageContent.includes('<@UDPPPM1PD>')) {
    if (greetingsRegex.test(messageContent)) {
      bot.postMessageToChannel(
        'aléatoire',
        `Bonjour <@${messageSender}>, en quoi puis-je vous aider ? (dites-moi 'help' pour en savoir plus)`,
      );
    } else if (chuckNorrisRegex.test(messageContent)) {
      chuckJoke();
    } else if (weatherRegex.test(messageContent)) {
      displayWeather();
    } else {
      runHelp();
    }
  }
}

// Start Handler
// bot.on('start', () => {
//   bot.postMessageToChannel(
//     'aléatoire',
//     "Bonjour ! Je suis @webpedagobot. Laissez-moi vous aider en me mentionnant avec 'help'.",
//   );
// });

// Error Handler
bot.on('error', (err) => {
  console.log(err);
});

// Message Handler
bot.on('message', (data) => {
  console.log(data);
  if (data.type === 'message' && data.username !== 'webpedagobot' && !data.subtype) {
    handleMessage(data);
  }
});
