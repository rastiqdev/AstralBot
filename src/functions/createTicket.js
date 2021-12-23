const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Permissions,
} = require("discord.js");

module.exports = async function (interaction) {
  const client = interaction.client;

  const category = await interaction.guild.channels.fetch(
    client.config.ticketCategoryId
  );
  const ticketChannel = await interaction.guild.channels.create(
    "ticket-" + interaction.user.username,
    {
      parent: category.id,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: [
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.VIEW_CHANNEL,
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
          ],
        },
      ],
    }
  );

  await interaction.reply({
    content: `<@${interaction.user.id}>Ticket créé avec succès, le voici : <#${ticketChannel.id}>`,
    ephemeral: true,
  });

  const messageData = {
    embeds: [
      new MessageEmbed({
        author: {
          name: `Ticket de ${interaction.user.tag}`,
        },
        description:
          `Bonjour <@${interaction.user.id}>, voici votre ticket.\n\nVeuillez exprimer **clairement** votre ` +
          "problème/demande et un membre du staff viendra s'en occuper au plus vite.\n\nPour fermer ce ticket, " +
          "appuyez sur le bouton 'Fermer le ticket'",
        color: "#0099ff",
        footer: {
          text: "Soyez patient, ne mentionnez pas le staff !",
        },
      }),
    ],
    components: [
      new MessageActionRow().addComponents([
        new MessageButton({
          label: "Fermer le ticket",
          custom_id: "close-ticket",
          style: "DANGER",
        }),
      ]),
    ],
  };

  const message = await ticketChannel.send(messageData);
  await message.pin();
  const msg = await ticketChannel.send({
    content: `<@${interaction.user.id}>`,
  });
  await msg.delete();
};
