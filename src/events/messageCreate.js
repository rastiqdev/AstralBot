const sendSuggestion = require("../functions/sendSuggestion");
const translate = require("../functions/translate");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.author.bot) return

        if (message.channelId === client.config.suggestionChannelId){
            await sendSuggestion(message)
            await message.delete()
        }

        if (message.channel.id === client.config.countingChannelId) {
            const currentNumber = await client.countdb.get(`${message.guild.id}`, "currentNumber")
            if (isNaN(message.content)) return message.delete()
            const authorid = await client.countdb.get(`${message.guild.id}`, "author")
            const proposedNumber = parseInt(message.content);
            if (message.author.id === authorid) return message.delete();
            if (proposedNumber - 1 !== currentNumber) return message.delete();
            await client.countdb.set(`${message.guild.id}`, proposedNumber, "currentNumber");
            await client.countdb.set(`${message.guild.id}`, message.author.id, "author");
        }
    }
}