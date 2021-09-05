const Chat = require('clever-chat')
require("./inline.js");
const chatSend = async (message) => {
    const chat = new Chat({ name: "Put Your Chatbot name here", gender: "Put your chatbot gender here", developer_name: "Put Your Name Here", user: message.author.id, language: "en" });
    //get more customisations at https://npmjs.com/package/clever-chat. TypeScript supported.
   
      message.channel.startTyping()
      let reply = await chat.chat(message.content).then(reply => {
          message.sendInline(reply, { allowedMentions: { repliedUser: false } }); 
          //you can set it to true!
          message.channel.stopTyping()
          
      })
console.log(reply)
}

module.exports = {
    chatSend
};