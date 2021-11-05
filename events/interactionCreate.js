const {Permissions} = require("discord.js");
module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                return interaction.reply(
                    {content: 'Une erreur s\'est produite pendant l\'exécution de cette commande !', ephemeral: true});
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === "delete_suggestion") {
                if (interaction.member.id === interaction.message.member.id ||
                    interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    await interaction.deferUpdate()
                    await interaction.message.delete()
                } else {
                    await interaction.reply({ content: "Vous n'êtes pas autorisé(e) à supprimer ce message", ephemeral: true })
                }
            }
        }
    }
}