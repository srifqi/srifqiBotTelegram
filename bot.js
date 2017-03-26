/**
 * srifqi's Bot for Telegram
 * License: MIT License
 */

console.log("srifqi's Bot for Telegram")
console.log('License: MIT License')
console.log('Initialising bot...')

const TelegramBot = require('node-telegram-bot-api')
const math = require('mathjs')
const express = require('express')
const PORT = process.env.PORT || 80

const server = express()
const httpserver = server.listen(PORT)
console.log('Listening on PORT ' + PORT)
server.use(express.static('./public/'))

const app = new TelegramBot(process.env.BOT_TOKEN, {polling: true})

// Using Markdown
const ABOUT = '@srifqiBot\n' +
  "srifqi's Bot on Telegram\n" +
  'License: MIT License\n\n' +
  'Found a bug or have ideas? Go to [issue tracker](https://github.com/srifqi/srifqiBotTelegram/issues).'

/*
about - About this bot
calc - Do simple math calculation
help - Display command list
rolldice - Roll a or n dice
tosscoin - Toss a or n coin(s)
 */
const HELP = 'Below is a list of my commands:\n' +
  '/about - About this bot\n' +
  '/calc <expr> - Do simple math calculation\n' +
  '/help - Display command list\n' +
  '/rolldice - Roll a dice\n' +
  '/rolldice <n> - Roll n dice\n' +
  '/tosscoin - Toss a coin\n' +
  '/tosscoin <n> - Toss n coins'

var botStart = (msg) => {
  // console.log('start', msg.from)
  app.sendMessage(msg.chat.id, 'Welcome!')
  app.sendMessage(msg.chat.id, HELP)
}

var botAbout = (msg) => {
  app.sendMessage(msg.chat.id, ABOUT, {parse_mode: 'Markdown'})
}

var botHelp = (msg) => {
  app.sendMessage(msg.chat.id, HELP)
}

var botCalc = (msg) => {
  if (/\/calc(?:@srifqiBot)?\s+(\S.*)/i.test(msg.text)) {
    var result = ''
    try {
      result = math.eval(/\/calc(?:@srifqiBot)?\s+(\S.*)/i.exec(msg.text)[1])
    } catch (e) {
      result = 'ERROR when processing formula.'
    }
    app.sendMessage(msg.chat.id, result, {reply_to_message_id: msg.message_id})
  } else {
    app.sendMessage(msg.chat.id, '[CA] What to calculate? Reply this message to answer.',
        {reply_to_message_id: msg.message_id})
  }
}

var botRollDice = (msg) => {
  if (/\/rolldice(?:@srifqiBot)?\s+(.+)/i.test(msg.text)) {
    amount = Number(/\/rolldice(?:@srifqiBot)?\s+(.+)/i.exec(msg.text)[1])
  } else {
    amount = 1
  }
  if (amount > 100) {
    app.sendMessage(msg.chat.id, 'Amount of dice is too large. Maximum amount is 100.')
    return
  }
  var result = ''
  for (let i = 0; i < amount; i++) {
    result += (i < 1 ? '' : ' ') + Math.ceil(Math.random() * 6)
  }
  app.sendMessage(msg.chat.id, result)
}

var botTossCoin = (msg) => {
  if (/\/tosscoin(?:@srifqiBot)?\s+(.+)/i.test(msg.text)) {
    amount = Number(/\/tosscoin(?:@srifqiBot)?\s+(.+)/i.exec(msg.text)[1])
  } else {
    amount = 1
  }
  if (amount > 100) {
    app.sendMessage(msg.chat.id, 'Amount of coin is too large. Maximum amount is 100.')
    return
  }
  var result = ''
  for (let i = 0; i < amount; i++) {
    result += (i < 1 ? '' : ' ') +
        ['head', 'tail'][Math.ceil(Math.random() * 2) - 1]
  }
  app.sendMessage(msg.chat.id, result)
}

app.onText(/\/start/, botStart)
app.onText(/\/about/, botAbout)
app.onText(/\/help/, botHelp)

app.onText(/\/calc(?: (.+)?)?/, botCalc)

app.onText(/\/rolldice(?: (.+)?)?/, botRollDice)
app.onText(/\/tosscoin(?: (.+)?)?/, botTossCoin)

app.onText(/@srifqiBot/, (msg) => app.sendMessage(msg.chat.id, 'Hey!'))

// logging | botCalc
app.onText(/.*/i, (msg) => {
  console.log(msg.from.username || '', ':', msg.text)
  if (msg.hasOwnProperty('reply_to_message')) {
    if (msg.reply_to_message.from.username === 'srifqiBot' &&
        msg.reply_to_message.hasOwnProperty('text')) {
      if (msg.reply_to_message.text.substr(0, 4) === '[CA]') {
        msg.text = '/calc@srifqiBot ' + msg.text
        botCalc(msg)
      }
    }
  }
})

app.on('sticker', (msg) => app.sendMessage(msg.chat.id, '👍'))

console.log('Bot started.')

// setInterval(() => console.log(Date.now()), 1e4)
