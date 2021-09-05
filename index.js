// Environmental Variable | Use built-in env in repl
require("dotenv").config();
// This is express, you can ignore this if you gonna self host
const chalk = require('chalk');
const express = require('express')
const app = express()
const port = 8080
const Chat = require('clever-chat')
require("./util/inline.js");



app.get('/', (req, res) => {
  res.send('Server Online! Bot is ready!!')
})

app.listen(port, () => {
    console.log(`${chalk.green(`Server online!`)}`)
})

// Code
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({
    disableEveryone: true
});
client.brain = require('./util/chatSend');
client.em = require("./util/embed")
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();


client.db = require('quick.db');
owner = "lol"

client.on('ready', () => {
  console.log(`${client.user.username} is Online`)
setInterval(async () => {
const statuses = [`awesome chatbot`, `| Made by ${owner}`]
   client.user.setActivity(statuses[Math.floor(Math.random() * statuses.length)], { type: "STREAMING", url: "https://www.twitch.tv/discord"})
}, 10000)
});

// Event Handler
fs.readdir('./events/', (err, files) => { 
    if (err) return console.error(err); 
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`); 
        if (eventFunction.disabled) return;

        const event = eventFunction.event || file.split('.')[0]; 
        const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
        const once = eventFunction.once; 

        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args, client)); 
        } catch (error) {
            console.error(error.stack); 
        }
    });
});

// Command Handler
client.on("message", async message => {
  if (message.author.bot || message.channel.type === "dm") return;
// command stuff
  let messageArray = message.content.split(" "),
    cmd = messageArray[0].toLowerCase(),
    args = messageArray.slice(1),
    prefix = "."; // Add Prefix

  if (!message.content.startsWith(prefix)) return;
  let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
  if (commandfile) commandfile.run(client, message, args);

});


fs.readdir("./commands/", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(R => R.endsWith('.js'));
  if (jsfile.length <= 0) {
    return console.log(chalk.red("There are no commands"));
  }
  jsfile.forEach((f, i) => {
    let pull = require(`./commands/${f}`);
    console.log(`Loaded - ${f} | ${pull.config.aliases}`)

    client.commands.set(pull.config.name, pull);
if (pull.config.aliases) pull.config.aliases.forEach(alias => client.aliases.set(alias, pull.config.name))
  });
});

client.on("message", async message => {
  if (message.channel.type === "dm") {
    if (message.author.bot) return;
    const chat = new Chat({ name: "Put Your Chatbot name here", gender: "Put your chatbot gender here", developer_name: "Put Your Name Here", user: "12345678910", language: "en" }); //put a random id here
    message.channel.startTyping();
    let reply = chat.chat(message.content).then(reply => {
        message.sendInline(reply, { allowedMentions: { repliedUser: false } });
    })
    message.channel.stopTyping();
  }
});
// Login
client.login(process.env.token);

// put your token here ^^
