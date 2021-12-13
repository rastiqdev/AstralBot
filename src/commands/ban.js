const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageButton, MessageActionRow, MessageEmbed } = require("discord.js");
const { isMod, isAdmin } = require("../functions/isModOrAdmin");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannir un membre (ADMIN).")
    .addUserOption(option =>
      option
        .setName("utilisateur")
        .setDescription("Le membre à bannir")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("raison")
        .setDescription("La raison pour laquelle bannir le membre")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const author = interaction.member;
    const user = interaction.options.getMember("utilisateur");
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("oui")
        .setLabel("Oui")
        .setStyle("SUCCESS"),
      new MessageButton().setCustomId("non").setLabel("Non").setStyle("DANGER")
    );
    if (
      !isMod(client, interaction.member) &&
      !isAdmin(client, interaction.member) &&
      !interaction.member.permissions.has("BAN_MEMBERS")
    ) {
      return interaction.reply({
        content: "Vous n'avez pas le droit d'exécuter cette commande !",
        ephemeral: true,
      });
    }
    await interaction.reply({
      content:
        "Voulez-vous bannir " +
        user.user.username +
        "#" +
        user.user.discriminator +
        " ?",
      components: [row],
      ephemeral: true,
    });
    const filter = i => i.user.id === author.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });

    const reason = interaction.options.getString("raison");

    collector.on("collect", async i => {
      if (i.customId === "oui") {
        await user.send(
          "Vous avez été banni de " +
            interaction.guild.name +
            " pour :\n`" +
            reason +
            "`"
        );
        await user.ban({ reason: reason });

        const embed = new MessageEmbed()
          .setAuthor("Membre banni")
          .setColor("#ff1500")
          .setTimestamp(Date.now())
          .setThumbnail(user.avatarURL({ dynamic: true }))
          .addField("Utilisateur :", `${user.id}`, true)
          .addField("Modérateur :", `<@${author.id}>`, true)
          .addField("Raison :", reason, true);

        const channel = await interaction.guild.channels.fetch(
          client.config.logs.modChannelId
        );
        await channel.send({ embeds: [embed] });

        await i.update({
          content:
            "Vous avez banni " +
            user.user.username +
            "#" +
            user.user.discriminator +
            " avec succès !",
          components: [],
        });
      } else {
        await i.update({ content: "Opération annulée !", components: [] });
      }
    });
  },
};
