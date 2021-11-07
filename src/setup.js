const {Client, Intents, MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton} = require("discord.js");
const config = require("../res/config.json")

require("dotenv").config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.guilds.fetch(config.mainGuildId).then(async guild => {
    // ROLES
    let row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Rien de selectioné')
                .setMinValues(0)
                .setMaxValues(2)
                .addOptions([
                    {
                        label: 'Annonces',
                        description: 'Annonces',
                        value: 'Annonces',
                    },
                    {
                        label: 'Vidéos & Lives',
                        description: 'Vidéos & Lives',
                        value: 'Vidéos',
                    },
                ]),
        );
    let embed = new MessageEmbed()
        .setTitle(`Choisissez vos rôles ici !`)
        .setColor("#0099ff")
        .setDescription(`Vous pouvez les sélectionner avec le select menu.`)
    await (await guild.channels.fetch(config.rolePannelChannelId)).send({embeds: [embed], components: [row]})

    // VERIFICATION
    embed = new MessageEmbed()
        .setTitle(`Vérification`)
        .setColor("#0099ff")
        .setDescription(`Veuillez cliquer sur le bouton ci-dessous pour avoir accès au serveur !`)
    row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Vérification")
                .setCustomId("commencer")
        )
    await (await guild.channels.fetch(config.verifChannelId)).send({embeds: [embed], components: [row]})

    console.log("Pannels envoyés avec succès.")
    client.destroy()
    process.exit()
})

client.login(process.env.TOKEN)

