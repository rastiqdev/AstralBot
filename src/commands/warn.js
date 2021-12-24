const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageButton, MessageActionRow } = require("discord.js");

const { isMod, isAdmin } = require("../functions/isModOrAdmin");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn quelqu'un (ADMIN).")
    .addUserOption(option =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à warn")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("raison")
        .setDescription("La raison pour warn cet utilisateur")
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const author = interaction.member;
    if (!isMod(client, author) && !isAdmin(client, author)) {
      return interaction.reply({
        content: "Vous n'avez pas le droit d'exécuter cette commande !",
        ephemeral: true,
      });
    }

    const user = interaction.options.getMember("utilisateur");

    if (user.user.bot) {
      return interaction.reply({
        content: "Vous ne pouvez pas warn des bots.",
        ephemeral: true,
      });
    }

    if (author.id === user.id) {
      return interaction.reply({
        content: "Vous ne pouvez pas vous warn vous-même.",
        ephemeral: true,
      });
    }

    const reason = interaction.options.getString("raison");

    if (!(await client.warnsdb.has(`${user.id}`, "warns"))) {
      await client.warnsdb.set(`${user.id}`, { warns: [{ reason: reason }] });
      await user.send(
        `Vous avez été warn dans **${interaction.guild.name}** par ${
          author.user.username + "#" + author.user.discriminator
        } pour ${reason}`
      );
      return interaction.reply({
        content: `Vous avez warn **${
          user.user.username + "#" + user.user.discriminator
        }** pour \`${reason}\``,
        ephemeral: true,
      });
    } else {
      const warnings = await client.warnsdb.get(`${user.id}`, "warns");
      warnings.push({ reason: reason });
      await client.warnsdb.set(`${user.id}`, warnings, "warns");
      await user.send(
        `Vous avez été warn dans **${interaction.guild.name}** par ${
          author.user.username + "#" + author.user.discriminator
        } pour ${reason}`
      );
      await interaction.reply({
        content: `Vous avez warn **${
          user.user.username + "#" + user.user.discriminator
        }** pour \`${reason}\``,
        ephemeral: true,
      });
      if (
        (await client.warnsdb.get(
          `${interaction.guild.id}_${user.id}`,
          "warns"
        )) === 3
      ) {
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId("oui")
            .setLabel("Oui")
            .setStyle("SUCCESS"),
          new MessageButton()
            .setCustomId("non")
            .setLabel("Non")
            .setStyle("DANGER")
        );
        await interaction.followUp({
          content:
            "Cet utilisateur a maintenant 3 warns ! Voulez vous le bannir ?",
          ephemeral: true,
          components: [row],
        });
        const filter = i => i.user.id === author.id;

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 15000,
        });

        const reason = interaction.options.getString("raison");

        collector.on("collect", async i => {
          if (i.customId === "oui") {
            await interaction.followUp({
              content: "En train de bannir cet utilisateur...",
              ephemeral: true,
            });
            await user.send(
              "Vous avez été banni de " +
                interaction.guild.name +
                " pour " +
                reason +
                "."
            );
            await user.ban({ reason: "3 warnings" });
            await interaction.followUp({
              content:
                "Vous avez banni " +
                user.user.username +
                "#" +
                user.user.discriminator +
                " avec succès !",
              components: [],
              ephemeral: true,
            });
          } else {
            await interaction.followUp({
              content: "Opération annulée !",
              components: [],
              ephemeral: true,
            });
          }
        });
      }
    }
  },
};
