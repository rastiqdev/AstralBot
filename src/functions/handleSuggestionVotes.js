const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = async function (interaction) {
  const user = interaction.member.id;
  const author = await interaction.client.votesdb.get(
    interaction.message.id,
    "author"
  );
  if (author === interaction.member.id) {
    return interaction.reply({
      content: "Vous ne pouvez pas voter à votre propre suggestion !",
      ephemeral: true,
    });
  }
  let votes = await interaction.client.votesdb.get(
    interaction.message.id,
    "votes"
  );
  votes = new Map(Object.entries(votes));
  let voteVal;
  if (interaction.customId === "upvote") voteVal = 1;
  else voteVal = -1;

  if (votes.has(user)) {
    if (votes.get(user) !== voteVal) {
      votes.set(user, voteVal);
    } else {
      votes.delete(user);
    }
  } else {
    votes.set(user, voteVal);
  }
  await interaction.client.votesdb.set(interaction.message.id, votes, "votes");
  const voteTotal = Array.from(votes.values()).reduce((a, b) => a + b, 0);

  const embed = interaction.message.embeds[0];
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setStyle("PRIMARY")
      .setLabel("Upvote")
      .setEmoji(":upvote:906184895611682826")
      .setCustomId("upvote"),
    new MessageButton()
      .setStyle("SECONDARY")
      .setLabel(voteTotal.toString())
      .setDisabled(true)
      .setCustomId("votenumbers"),
    new MessageButton()
      .setStyle("DANGER")
      .setLabel("Downvote")
      .setEmoji(":downvote:906184926146216006")
      .setCustomId("downvote")
  );
  await interaction.message.edit({ embeds: [embed], components: [row] });
  await interaction.deferUpdate();
};
