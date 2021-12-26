const sendSuggestion = require("../functions/sendSuggestion");
const mexp = require("math-expression-evaluator");

module.exports = {
  name: "messageCreate",
  async execute(client, message) {
    if (message.author.bot) return;

    if (message.channelId === client.config.suggestionChannelId) {
      await sendSuggestion(message);
      await message.delete();
    }

    if (message.channel.id === client.config.countingChannelId) {
      const currentNumber = await client.countdb.get(
        `${message.guild.id}`,
        "currentNumber"
      );
      if (!message.content) return message.delete();
      const authorid = await client.countdb.get(
        `${message.guild.id}`,
        "author"
      );
      let proposedNumber;
      try {
        proposedNumber = mexp.eval(message.content);
      } catch (e) {
        return message.delete();
      }
      if (message.author.id === authorid) return message.delete();
      if (proposedNumber - 1 !== currentNumber) return message.delete();
      await client.countdb.set(
        `${message.guild.id}`,
        proposedNumber,
        "currentNumber"
      );
      await client.countdb.set(
        `${message.guild.id}`,
        message.author.id,
        "author"
      );
    }
  },
};
