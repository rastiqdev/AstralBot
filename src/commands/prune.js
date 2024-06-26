const { SlashCommandBuilder } = require("@discordjs/builders");
const { isMod, isAdmin } = require("../functions/isModOrAdmin");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Supprimer jusqu'à 99 messages (ADMIN).")
    .addIntegerOption(option =>
      option
        .setName("nombre")
        .setDescription("Nombre de messages à supprimer.")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    if (
      !isMod(client, interaction.member) &&
      !isAdmin(client, interaction.member) &&
      !interaction.member.permissions.has("MANAGE_MESSAGES")
    ) {
      return interaction.reply({
        content: "Vous n'avez pas le droit d'exécuter cette commande !",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("nombre");

    if (amount <= 1 || amount > 100) {
      return interaction.reply({
        content: "Vous devez entrer un nombre entre 1 et 99.",
        ephemeral: true,
      });
    }
    await interaction.channel.bulkDelete(amount, true).catch(error => {
      client.logger.error(error);
      interaction.reply({
        content: "Je n'ai pas pu supprimer les messages dans ce salon !",
        ephemeral: true,
      });
    });

    return interaction.reply({
      content: `\`${amount}\` messages ont été supprimés.`,
    });
  },
};
