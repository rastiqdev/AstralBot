const {createCanvas} = require("canvas");
const Canvas = require("canvas");
const {MessageAttachment, MessageEmbed} = require("discord.js");
module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {
        const canvas = createCanvas(900, 300)
        const ctx = canvas.getContext("2d")

        const img = await Canvas.loadImage(__dirname + "/../../res/welcome_image.png")
        ctx.drawImage(img, 0, 0, 900, 300)

        const avatar = await Canvas.loadImage(member.avatarURL({ size: 300, format: "png" }))

        const x = 600
        const y = 0
        const w = 300
        const h = 300
        const radius = 150

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        ctx.clip();
        ctx.drawImage(avatar, x, y, w, h);
        ctx.restore();

        const attachment = new MessageAttachment(canvas.toBuffer(), "welcome_img.png")
        const embed = new MessageEmbed()
            .setTitle(`${member.user.tag} a rejoint le serveur !`)
            .setDescription("🎉 Bienvenue à toi ! 🎉")
            .setImage("attachment://welcome_img.png")
        await (await member.guild.channels.fetch(client.config.welcomeChannelId)).send({ embeds: [embed], files: [attachment]})
    }
}