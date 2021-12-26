const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mcskin")
    .setDescription("Avoir le skin Minecraft de quelqu'un.")
    .addStringOption(option =>
      option
        .setName("utilisateur")
        .setDescription(
          "Nom d'utilisateur dont l'avatar doit être montré (Pas l'UUID hein)"
        )
        .setRequired(true)
    ),
  async execute(client, interaction) {
    const user = interaction.options.getString("utilisateur");
    const data = await fetch(
      `https://api.mojang.com/users/profiles/minecraft/${user}`
    ).then(data => data.json());
    if (data.error)
      return interaction.reply({
        content:
          "Une erreur est survenue. Veuillez vérifier que vous avez bien entré un nom d'utilisateur et non un UUID.",
        ephemeral: true,
      });
    const uuid = data.id;

    return interaction.reply(
      `Voici le [skin](https://visage.surgeplay.com/full/512/${uuid}) de ${user}. Si vous voulez mettre son skin, le lien est [ici](https://crafatar.com/skins/${uuid})`
    );
  },
};
