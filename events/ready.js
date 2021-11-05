module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log('Connecté en tant que ' + client.user.username + "#" + client.user.discriminator + ' !');
        client.user.setPresence({ activities: [{ name: 'RASTIQ#0001' }], status: 'dnd' });
    }
}