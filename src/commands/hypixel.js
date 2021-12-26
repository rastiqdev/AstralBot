const { SlashCommandBuilder } = require("@discordjs/builders");
const Hypixel = require("hypixel");
const hypixelclient = new Hypixel({ key: process.env.HYPIXEL_API_KEY });
const sendHypixelGlobalImage = require("../functions/sendHypixelGlobalImage");
const sendHypixelBedwarsImage = require("../functions/sendHypixelBedwarsImage");
const sendHypixelSkywarsImage = require("../functions/sendHypixelSkywarsImage");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hypixel")
    .setDescription("Avoir des informations de l'API Hypixel.")
    .addSubcommand(command =>
      command
        .setName("stats")
        .setDescription("Avoir les stats de quelqu'un dans un jeu")
        .addStringOption(option =>
          option
            .setName("utilisateur")
            .setDescription("L'utilisateur dont les stats sont recherchées")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("jeu")
            .setDescription(
              "Le jeu sur lequel doivent être les stats (laisser vide pour les stats globales)"
            )
            .addChoice("Bedwars", "bedwars")
            .addChoice("Skywars", "skywars")
        )
    ),
  execute(client, interaction) {
    if (interaction.options.getSubcommand() === "stats") {
      try {
        const user = interaction.options.getString("utilisateur");

        hypixelclient.getPlayerByUsername(user, async (err, player) => {
          if (err) {
            return await interaction.reply({
              content:
                "Une erreur est survenue. Veuillez vérifier que vous avez bien entré un nom d'utilisateur et non un UUID. Si vous rencontrez encore des problèmes, attendez une minute et réessayez.",
              ephemeral: true,
            });
          }

          interaction.reply({ content: "Envoi du panel...", ephemeral: true });

          if (interaction.options.getString("jeu") === null) {
            await sendHypixelGlobalImage(interaction, player, user);
          } else if (interaction.options.getString("jeu") === "bedwars") {
            await sendHypixelBedwarsImage(interaction, player, user);
          } else if (interaction.options.getString("jeu") === "skywars") {
            await sendHypixelSkywarsImage(interaction, player, user);
          }
        });
      } catch (e) {
        client.logger.error(`hypixel command : ${e}`);
      }
    }
  },
};
