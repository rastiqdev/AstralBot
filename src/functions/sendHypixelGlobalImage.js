const Jimp = require('jimp');
const path = require('path');
const {MessageAttachment, MessageEmbed} = require("discord.js");
const timestampToDate = require('../functions/timestampToDate');
const fetch = require('node-fetch');

module.exports = sendWelcomeImage = async function(interaction, player, username) {

    try {
        const uuid = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
          .then(data => data.json())
          .then(player => player.id);
        const canvas = new Jimp(500, 150);
        const avatar = await Jimp.read(`https://visage.surgeplay.com/bust/512/${uuid}`);
  
        const Quantify_50_white = await Jimp.loadFont(path.join(__dirname, '../../res/fonts/Quantify_50_white.fnt'));
        const Quantify_20_white = await Jimp.loadFont(path.join(__dirname, '../../res/fonts/Quantify_20_white.fnt'));
        const mask = await Jimp.read('https://raw.githubusercontent.com/CoderDixs/DraftBot/master/images/avatarMask.png');
  
        avatar.resize(136, Jimp.AUTO);
        mask.resize(136, Jimp.AUTO);
        avatar.mask(mask, 0, 0);
  
        canvas.blit(avatar, 5, 5);
  
        canvas.print(Quantify_50_white, 158, 20, await getRank(player));
        canvas.print(Quantify_20_white, 158, 70, 'Première connexion :');
        canvas.print(Quantify_20_white, 158, 87, await timestampToDate(player.firstLogin));
        if (player.lastLogin) {
          canvas.print(Quantify_20_white, 158, 105, 'Dernière connexion :');
          canvas.print(Quantify_20_white, 158, 122, await timestampToDate(player.lastLogin));
        }
  
        const buffer = await canvas.getBufferAsync(Jimp.MIME_PNG);
        const attachment = new MessageAttachment(buffer, 'joinimg.png');
  
        const embed = new MessageEmbed()
        .setTitle(`Stats de ${player.displayname}`)
        .setDescription(`Voici les stats Hypixel de ${player.displayname}`)
        .setImage("attachment://joinimg.png")
        .setColor("#0099ff")
        .setFooter("AstralHypixel")
        
        await interaction.followUp({ embeds: [embed], files: [attachment]})
      } catch (error) {
        return console.log('HypixelGlobalImage => ',error);
      }

}

async function getRank(player) {
  if (player.rank === "YOUTUBER") {
    return "Grade: YT"
  }

  if (!player.newPackageRank) return "Pas de grade"

  if (player.newPackageRank === "VIP_PLUS") return "Grade: VIP+"

  if (player.newPackageRank === "MVP_PLUS") {
    if (player.monthlyPackageRank === "SUPERSTAR") {
      return "Grade: MVP++"
    }else{
      return "Grade: MVP+"
    }
  }

  return player.newPackageRank;
}