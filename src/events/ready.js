const {MessageEmbed} = require("discord.js");
const cron = require("node-cron")
const updateSubCount = require('../functions/updateSubCount');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        client.logger.info(`Connecté à discord en tant que ${client.user.tag} (Id : ${client.user.id})`);

        const embed = new MessageEmbed()
            .setAuthor("Bot en ligne !")
        const channel = await (
            await client.guilds.fetch(client.config.mainGuildId)).channels.fetch(client.config.logs.botChannelId)
        await channel.send({ embeds: [embed] })

        const activities = [
            "s'abonner à Astral",
            `${(await client.guilds.fetch(client.config.mainGuildId)).memberCount} membres ! 🎉`,
            `RASTIQ & Léo-21`
        ]

        const activprefix = [
            "PLAYING",
            "WATCHING",
            "WATCHING"
        ]

        // Repeat every 20 minutes
        cron.schedule("*/20 * * * *", async () => {
            updateSubCount(client)
        })

        const setPresence = function(number) {
            client.user.setPresence({
                status: "dnd",
                activities: [{ name: activities[number], type: activprefix[number] }],
            })
        }

        setPresence(0)
        setTimeout(function(){ 
            setPresence(1)
            setTimeout(function(){
                setPresence(2)
            }, 10000);
        }, 10000);

        setInterval(async () => {
            setPresence(0)
            setTimeout(function(){ 
                setPresence(1)
                setTimeout(function(){
                    setPresence(2)
                }, 10000);
            }, 10000);
        }, 30000)
    }
}