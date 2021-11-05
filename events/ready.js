module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log('Connecté en tant que ' + client.user.username + "#" + client.user.discriminator + ' !');

        setInterval(async () => {
            client.user?.setPresence({
                afk: false,
                status: "online",
                activities: [
                    {
                        name: "m'abonner à astral et à activer la cloche 🔔",
                        type: "PLAYING"
                    },
                    {
                        name: `${(await client.guilds.fetch(process.env.GUILDID)).memberCount} membres ! 🎉`,
                        type: "WATCHING"
                    },
                ]
            })
        }, 10000)
    }
}