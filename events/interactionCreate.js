module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply(
                { content: 'Une erreur s\'est produite pendant l\'exécution de cette commande !', ephemeral: true });
        }
    }
}