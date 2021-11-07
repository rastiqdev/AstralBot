const sendSuggestion = require("../functions/sendSuggestion")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.author.bot) return

        if (message.channelId !== client.config.suggestionChannelId) return
        await sendSuggestion(message)
    }
}