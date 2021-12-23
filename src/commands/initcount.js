const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("initcount")
    .setDescription("Initialiser le système de comptage (ADMIN)."),
  async execute(client, interaction) {
    const author = interaction.member;
    if (!author.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return interaction.reply({
        content: "Vous n'avez pas le droit d'exécuter cette commande !",
        ephemeral: true,
      });
    }
    await client.countdb.set(`${interaction.guild.id}`, {
      author: "null",
      currentNumber: 0,
    });
    interaction.reply({
      content: "Système de comptage initialisé !",
      ephemeral: true,
    });
  },
};
