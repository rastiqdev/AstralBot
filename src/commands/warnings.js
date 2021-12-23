const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const { isMod, isAdmin } = require("../functions/isModOrAdmin");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Voir les warnings de quelqu'un.")
    .addUserOption(option =>
      option
        .setName("utilisateur")
        .setRequired(true)
        .setDescription("L'utilsateur dont vous voulez voir les warns")
    ),
  async execute(client, interaction) {
    if (
      !isMod(client, interaction.member) &&
      !isAdmin(client, interaction.member)
    ) {
      return interaction.reply({
        content: "Vous n'avez pas le droit d'exécuter cette commande !",
        ephemeral: true,
      });
    }

    const user = interaction.options.getMember("utilisateur");

    const embed = new MessageEmbed()
      .setAuthor(`Liste des warns de ${user.user.tag}`)
      .setColor("#0099ff");
    if (!(await client.warnsdb.has(`${user.id}`, "warns")))
      embed.description = "Cet utilisateur n'a aucun warns.";
    else {
      const warns = await client.warnsdb.get(`${user.id}`, "warns");
      embed.description = warns.map(warn => "- " + warn.reason).join("\n");
    }

    await interaction.reply({ embeds: [embed] });
  },
};
