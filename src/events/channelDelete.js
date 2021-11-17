module.exports = {
    name: "messageCreate",
    async execute(client, message) {

const category = channel.guild.channels.cache.find((x) => x.name == "Mod Mail")
     if (!category) return client.log(translate("system.PARENT_MISSING"))
 
     const member = channel.guild.members.cache.get(channel.name) || await channel.guild.members.fetch(channel.name).catch(err => { })
     if (!member) return client.log(translate("system.MEMBER_NOT_FOUND", { member: "XXX" }))
 
     const embed = new MessageEmbed()
         .setAuthor(translate("system.DELETE_EMBED.AUTHOR"), client.user.displayAvatarURL())
         .setColor('RED')
         .setThumbnail(client.user.displayAvatarURL())
         .setDescription(translate("system.DELETE_EMBED.DESCRIPTION"))
 
     return member.send({ embeds: [embed] }).catch(err => { })
    }}