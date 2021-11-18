const sendSuggestion = require("../functions/sendSuggestion");
const translate = require("../../tools/translate");
const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if (message.author.bot) return

        if (message.channelId === client.config.suggestionChannelId){
            await sendSuggestion(message)
            await message.delete()
        }

        if (message.channel.id === client.config.countingChannelId) {
            const currentNumber = await client.countdb.get(`${message.guild.id}`, "currentNumber")
            if (isNaN(message.content)) return message.delete()
            const authorid = await client.countdb.get(`${message.guild.id}`, "author")
            const proposedNumber = parseInt(message.content);
            if (message.author.id === authorid) return message.delete();
            if (proposedNumber - 1 !== currentNumber) return message.delete();
            client.countdb.set(`${message.guild.id}`, proposedNumber, "currentNumber");
            client.countdb.set(`${message.guild.id}`, message.author.id, "author");
        }

        if (!message.guild) {
            const guild = client.guilds.cache.get(client.config.modMailServerId) || await client.guilds.fetch(client.config.modMailServerId).catch(m => { })
            const member = guild.members.cache.get(message.author.id) || await guild.members.fetch(message.author.id).catch(err => { })
    
    
            if (!member) return client.log(translate("system.MEMBER_NOT_FOUND", { member: message.author.tag }))
    
            const category = guild.channels.cache.find((x) => x.name == "ModMail")
    
            let channel = guild.channels.cache.find((x) => x.name == message.author.id && x.parentId === category.id)
    
            if (!channel) {
                channel = await guild.channels.create(message.author.id, {
                    type: "text",
                    parent: category.id
                })
    
                let success_embed = new MessageEmbed()
                    .setAuthor(translate("system.SUCCESS_EMBED.AUTHOR"))
                    .setColor("GREEN")
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(translate("system.SUCCESS_EMBED.DESCRIPTION"))
    
                message.author.send({ embeds: [success_embed] })
    
    
                let details_embed = new MessageEmbed()
                    .setAuthor(translate("system.DETAILS_EMBED.AUTHOR"), message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setColor("BLUE")
                    .setThumbnail(message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(translate("system.DETAILS_EMBED.DESCRIPTION", { content: message.content }))
                    .addField("Nom", message.author.username)
                    .addField("Date de création de compte", message.author.createdAt.toString())
    
    
                return channel.send({ embeds: [details_embed] })
            }
    
            let content_embed = new MessageEmbed()
                .setColor("YELLOW")
                .setFooter(message.author.tag, message.author.displayAvatarURL({
                    dynamic: true
                }))
                .setDescription(message.content)
    
            if (message.attachments.size) content_embed.setImage(message.attachments.map(x => x)[0].proxyURL)
            channel.send({ embeds: [content_embed] })
    
        } else if (message.channel.parentId) {
            const category = message.guild.channels.cache.find((x) => x.name == "ModMail")
    
            if (message.channel.parentId === category.id) {
                let member = message.guild.members.cache.get(message.channel.name) || await message.guild.members.fetch(message.channel.name).catch(err => { })
                if (!member) return message.channel.send(translate("system.MEMBER_NOT_FOUND", { member: message.author.tag }))
    
                let content_embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setFooter(message.author.username, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setDescription(translate("system.DETAILS_EMBED.DESCRIPTION", { content: message.content }))
    
                if (message.attachments.size) content_embed.setImage(message.attachments.map(x => x)[0].proxyURL)
                return member.send({ embeds: [content_embed] })
            }
        }
    }
}