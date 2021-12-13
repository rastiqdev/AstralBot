const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Afficher des informations à propos du serveur."),
  async execute(client, interaction) {
    const reply = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Informations du serveur")
      .setAuthor("AstralBot")
      .addFields(
        { name: "Nom du serveur", value: `${interaction.guild.name}` },
        { name: "Nombre de membres", value: `${interaction.guild.memberCount}` }
      )
      .setTimestamp()
      .setFooter(
        "Demandé par " +
          interaction.user.username +
          "#" +
          interaction.user.discriminator,
        interaction.user.displayAvatarURL
      );
    return interaction.reply({ embeds: [reply] });
  },
};
