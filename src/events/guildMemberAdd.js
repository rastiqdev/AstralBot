const sendWelcomeImage = require('../functions/sendWelcomeImage'); 
module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {

        sendWelcomeImage(client, member)

    }
}