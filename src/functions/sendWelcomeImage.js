const Jimp = require("jimp");
const path = require("path");
const { MessageAttachment, MessageEmbed } = require("discord.js");

module.exports = async function (client, member) {
  try {
    const canvas = new Jimp(500, 150);
    const avatar = await Jimp.read(
      member.user.displayAvatarURL({ format: "png" })
    );

    const Quantify_55_white = await Jimp.loadFont(
      path.join(__dirname, "../../res/fonts/Quantify_55_white.fnt")
    );
    const Quantify_25_white = await Jimp.loadFont(
      path.join(__dirname, "../../res/fonts/Quantify_25_white.fnt")
    );
    const OpenSans_22_white = await Jimp.loadFont(
      path.join(__dirname, "../../res/fonts/OpenSans_22_white.fnt")
    );
    const mask = await Jimp.read(
      "https://cloud.githubusercontent.com/assets/414918/11165709/051d10b0-8b0f-11e5-864a-20ef0bada8d6.png"
    );

    avatar.resize(136, Jimp.AUTO);
    mask.resize(136, Jimp.AUTO);
    avatar.mask(mask, 0, 0);

    canvas.blit(avatar, 5, 5);

    canvas.print(Quantify_55_white, 158, 20, "Bienvenue");
    canvas.print(OpenSans_22_white, 158, 70, "sur le serveur Discord");
    canvas.print(Quantify_25_white, 158, 105, "Le Nid d'Astral");

    const buffer = await canvas.getBufferAsync(Jimp.MIME_PNG);
    const attachment = new MessageAttachment(buffer, "joinimg.png");

    const embed = new MessageEmbed()
      .setTitle(`${member.user.tag} a rejoint le serveur !`)
      .setDescription("🎉 Bienvenue à toi ! 🎉")
      .setImage("attachment://joinimg.png")
      .setColor("#0099ff")
      .setFooter(
        "On est maintenant " + member.guild.memberCount + " membres !"
      );

    const channel = await member.guild.channels.fetch(
      client.config.welcomeChannelId
    );
    await channel.send({ embeds: [embed], files: [attachment] });
  } catch (error) {
    client.logger.error(`welcome image : ${error}`);
  }
};
