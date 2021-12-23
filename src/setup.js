const {
  Client,
  Intents,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require("discord.js");
const config = require("../res/config.json");

require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
  const guild = await client.guilds.fetch(config.mainGuildId);
  // ROLES
  let row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Rien de selectioné")
      .setMinValues(0)
      .setMaxValues(2)
      .addOptions([
        {
          label: "Annonces",
          description: "Annonces",
          value: "Annonces",
        },
        {
          label: "Vidéos & Lives",
          description: "Vidéos & Lives",
          value: "Vidéos",
        },
      ])
  );
  let embed = new MessageEmbed()
    .setTitle("Choisissez vos rôles ici !")
    .setColor("#0099ff")
    .setDescription("Vous pouvez les sélectionner avec le select menu.");
  await (
    await guild.channels.fetch(config.rolePannelChannelId)
  ).send({ embeds: [embed], components: [row] });

  // VERIFICATION
  embed = new MessageEmbed()
    .setTitle("Vérification")
    .setColor("#0099ff")
    .setDescription(
      "Veuillez cliquer sur le bouton ci-dessous pour avoir accès au serveur !"
    );
  row = new MessageActionRow().addComponents(
    new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("Vérification")
      .setCustomId("commencer")
  );
  await (
    await guild.channels.fetch(config.verifChannelId)
  ).send({ embeds: [embed], components: [row] });

  // TICKETS
  embed = new MessageEmbed()
    .setTitle("Tickets")
    .setColor("#0099ff")
    .setDescription(
      "Vous avez un problème ? Vous avez besoin de contacter le staff pour je ne sais quoi en privé " +
        "?\nAlors créez un ticket !\n\nPour cela, rien de plus simple, vous devez simplement cliquer sur le bouton " +
        "ci-dessous."
    );
  row = new MessageActionRow().addComponents(
    new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("Créer un ticket")
      .setCustomId("create-ticket")
  );
  await (
    await guild.channels.fetch(config.ticketChannelId)
  ).send({ embeds: [embed], components: [row] });

  // eslint-disable-next-line no-console
  console.log("Pannels envoyés avec succès.");
  client.destroy();
  process.exit();
});

client.login(process.env.TOKEN);
