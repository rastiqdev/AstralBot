const { google } = require("googleapis")

module.exports = updateSubCount = async function(client) {
    const youtube = google.youtube("v3")
    const subChannel = await (
        await client.guilds.fetch(client.config.mainGuildId)).channels.fetch(client.config.subCounterChannelId)
    const viewsChannel = await (
        await client.guilds.fetch(client.config.mainGuildId)).channels.fetch(client.config.viewsCounterChannelId)

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
}