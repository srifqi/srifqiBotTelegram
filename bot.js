/**
 * srifqi's Bot for Telegram
 * License: MIT
 */

console.log("srifqi's Bot for Telegram")
console.log('License: MIT License')
console.log('Initialising bot...')

const Telegraf = require('telegraf')
const math = require('mathjs')
const express = require('express')
const PORT = process.env.PORT || 80

const server = express()
const httpserver = server.listen(PORT)
console.log('Listening on PORT ' + PORT)
server.use(express.static('./public/'))

const app = new Telegraf(process.env.BOT_TOKEN)

app.telegram.getMe().then((botInfo) => {
  app.options.username = botInfo.username
})

/*
calc - Do simple math calculation
help - Display command list
rolldice - Roll a or n dice
tosscoin - Toss a or n coin(s)
 */
const HELP = 'Below is a list of my commands:\n' +
  '(Hold down the command to copy)\n' +
  '/calc <expr> - Do simple math calculation\n' +
  '/help - Display command list\n' +
  '/rolldice - Roll a dice\n' +
  '/rolldice <n> - Roll n dice\n' +
  '/tosscoin - Toss a coin\n' +
  '/tosscoin <n> - Toss n coins'

var botStart = (ctx) => {
  // console.log('start', ctx.from)
  ctx.reply('Welcome!')
  ctx.reply(HELP)
}

var botHelp = (ctx) => {
  ctx.reply(HELP)
}

var botCalc = (ctx) => {
  if (/\/calc(?:@srifqiBot)?\s+(\S.*)/i.test(ctx.message.text)) {
    var result = ''
    try {
      result = math.eval(/\/calc(?:@srifqiBot)?\s+(\S.*)/i.exec(ctx.message.text)[1])
    } catch (e) {
      result = 'ERROR when processing formula.'
    }
    ctx.reply(result, {reply_to_message_id: ctx.message.message_id})
  } else {
    ctx.reply('[CA] What to calculate? Reply this message to answer.',
        {reply_to_message_id: ctx.message.message_id})
  }
}

var botRollDice = (ctx) => {
  if (/\/rolldice(?:@srifqiBot)?\s+(.+)/i.test(ctx.message.text)) {
    amount = Number(/\/rolldice(?:@srifqiBot)?\s+(.+)/i.exec(ctx.message.text)[1])
  } else {
    amount = 1
  }
  if (amount > 100) {
    ctx.reply('Amount of dice is too large. Maximum amount is 100.')
    return
  }
  var result = ''
  for (let i = 0; i < amount; i++) {
    result += (i < 1 ? '' : ' ') + Math.ceil(Math.random() * 6)
  }
  ctx.reply(result)
}

var botTossCoin = (ctx) => {
  if (/\/tosscoin(?:@srifqiBot)?\s+(.+)/i.test(ctx.message.text)) {
    amount = Number(/\/tosscoin(?:@srifqiBot)?\s+(.+)/i.exec(ctx.message.text)[1])
  } else {
    amount = 1
  }
  if (amount > 100) {
    ctx.reply('Amount of coin is too large. Maximum amount is 100.')
    return
  }
  var result = ''
  for (let i = 0; i < amount; i++) {
    result += (i < 1 ? '' : ' ') +
        ['head', 'tail'][Math.ceil(Math.random() * 2) - 1]
  }
  ctx.reply(result)
}

app.command('start', botStart)
app.command('help', botHelp)

app.command('calc', botCalc)

app.command('rolldice', botRollDice)
app.command('tosscoin', botTossCoin)

app.hears(/@srifqiBot/, (ctx) => ctx.reply('Hey!'))

// logging | botCalc
app.hears(/.*/i, (ctx) => {
  console.log(ctx.message)
  var msg = ctx.update.message
  if (msg.hasOwnProperty('reply_to_message')) {
    if (msg.reply_to_message.from.username === 'srifqiBot' &&
        msg.reply_to_message.hasOwnProperty('text')) {
      if (msg.reply_to_message.text.substr(0, 4) === '[CA]') {
        ctx.message.text = '/calc@srifqiBot ' + ctx.message.text
        botCalc(ctx)
      }
    }
  }
})

app.on('sticker', (ctx) => ctx.reply('👍'))

app.startPolling()

console.log('Bot started.')

setInterval(() => console.log(Date.now()), 1e4)
