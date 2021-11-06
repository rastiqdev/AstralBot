module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log('Connecté en tant que ' + client.user.username + "#" + client.user.discriminator + ' !');

        const activities = [
            "s'abonner à Astral",
            `${(await client.guilds.fetch(process.env.GUILDID)).memberCount} membres ! 🎉`,
            `RASTIQ & Léo-21`
        ]

        const activprefix = [
            "PLAYING",
            "WATCHING",
            "WATCHING"
        ]

        const setPresence = function(number) {
            client.user.setPresence({
                status: "dnd",
                activities: [{ name: activities[number], type: activprefix[number] }],
            })
        }

        setInterval(async () => {
            setPresence(1)
            setTimeout(function(){ 
                setPresence(2)
                setTimeout(function(){
                    setPresence(3)
                }, 10000);
            }, 10000);
        }, 30000)
    }
}