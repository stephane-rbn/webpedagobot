require('dotenv').config();

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
  axios.get(`http://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${process.env.OPEN_WEATHER_APP_KEY}`)
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
    "Dites-moi 'météo' pour obtenir la température actuelle à Paris ou 'chucknorris' pour rire un petit coup.",
  );
}

// Response to Data
function handleMessage(message) {
  const messageContent = message.text;
  const messageSender = message.user;

  if (messageContent.includes(' Salut')) {
    bot.postMessageToChannel(
      'aléatoire',
      `Bonjour <@${messageSender}>, en quoi puis-je vous aider ? (dites-moi 'help' pour en savoir plus)`,
    );
  } else if (messageContent.includes(' chucknorris')) {
    chuckJoke();
  } else if (messageContent.includes(' météo')) {
    displayWeather();
  } else if (messageContent.includes(' help')) {
    runHelp();
  }
}

// Start Handler
bot.on('start', () => {
  bot.postMessageToChannel(
    'aléatoire',
    "Bonjour ! Je suis @webpedagobot. Laissez-moi vous aider en me mentionnant avec 'help'.",
  );
});

// Error Handler
// bot.on('error', (err) => {
//   console.log(err);
// });

// Message Handler
bot.on('message', (data) => {
  if (data.type !== 'message') {
    return;
  }

  handleMessage(data);
});
