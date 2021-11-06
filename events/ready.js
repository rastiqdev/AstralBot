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
                        name: "s'abonner à Astral",
                        type: "PLAYING"
                    },
                    {
                        name: `${(await client.guilds.fetch(process.env.GUILDID)).memberCount} membres ! 🎉`,
                        type: "WATCHING"
                    },
                    {
                        name: `RASTIQ & Léo-21`,
                        type: "WATCHING"
                    },
                ]
            })
        }, 10000)
    }
}