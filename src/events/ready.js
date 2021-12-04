const {MessageEmbed} = require("discord.js");
const cron = require("node-cron")
const { google } = require("googleapis")

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

        const youtube = google.youtube("v3")
        const subChannel = await (
            await client.guilds.fetch(client.config.mainGuildId)).channels.fetch(client.config.subCounterChannelId)
        const viewsChannel = await (
            await client.guilds.fetch(client.config.mainGuildId)).channels.fetch(client.config.viewsCounterChannelId)

        // Repeat every 20 minutes
        cron.schedule("*\20 * * * *", async () => {
            const res = await youtube.channels.list({
                auth: process.env.YOUTUBE_API_KEY,
                id: client.config.astralYoutubeChannelId,
                part: ["statistics"]
            })

            const statistics = res.data.items[0].statistics

            await subChannel.setName(`Abonnés : ${statistics.subscriberCount} ${statistics.subscriberCount.includes("69") ? "(nice)" : ""}`)
            await viewsChannel.setName(`Total de vues : ${statistics.viewCount} ${statistics.videoCount.includes("69") ? "(nice)" : ""}`)
            // await subChannel.setTopic(`${statistics.subscriberCount} abonnés ` +
            //     `${statistics.subscriberCount.includes("69") ? "(nice)" : ""}, ${statistics.videoCount} vidéos ` +
            //     `${statistics.videoCount.includes("69") ? "(nice)" : ""} et un total de ${statistics.viewCount} ` +
            //     `${statistics.viewCount.includes("69") ? "(nice)" : ""} vues !`)

            client.logger.debug("Updated the subscribers counter !")
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