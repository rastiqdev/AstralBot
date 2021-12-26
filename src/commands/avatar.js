const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Avoir l'avatar de quelqu'un ou de soi-même.")
    .addUserOption(option =>
      option
        .setName("utilisateur")
        .setDescription("Utilisateur dont l'avatar doit être montré")
    ),
  async execute(client, interaction) {
    const user = interaction.options.getUser("utilisateur") || interaction.user;
    return await interaction.reply(
      `Voici l'[avatar](${user.displayAvatarURL({
        dynamic: true,
      })}) de ${user}.`
    );
  },
};
