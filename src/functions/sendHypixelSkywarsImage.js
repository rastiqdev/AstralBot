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
  
        if (player.stats.SkyWars.skywars_experience) {
          canvas.print(Quantify_50_white, 158, 20, `Niveau ${await Math.trunc(await xpToLevel(player.stats.SkyWars.skywars_experience))}`);
        }
        if (player.achievements.skywars_wins_solo) {
          canvas.print(Quantify_20_white, 158, 77, `Total de ${player.achievements.skywars_wins_solo + player.achievements.skywars_wins_team} wins`);
        }
        if (player.stats.SkyWars.losses_solo) {
          canvas.print(Quantify_20_white, 158, 105, `Total de ${player.stats.SkyWars.losses_solo + player.stats.SkyWars.losses_team} parties perdues`);
        }
  
        const buffer = await canvas.getBufferAsync(Jimp.MIME_PNG);
        const attachment = new MessageAttachment(buffer, 'joinimg.png');
  
        const embed = new MessageEmbed()
        .setTitle(`Stats de ${player.displayname}`)
        .setDescription(`Voici les stats Hypixel de ${player.displayname} en Bedwars`)
        .setImage("attachment://joinimg.png")
        .setColor("#0099ff")
        .setFooter("AstralHypixel")
        
        await interaction.followUp({ embeds: [embed], files: [attachment]})
      } catch (error) {
        return console.log('HypixelGlobalImage => ',error);
      }

}

async function xpToLevel(xp) {
  let xps = [0, 20, 70, 150, 250, 500, 1000, 2000, 3500, 6000, 10000, 15000];
  if(xp >= 15000) {
    return (xp - 15000) / 10000 + 12;
  } else {
    for(i = 0; i < xps.length; i++) {
      if(xp < xps[i]) {
        return i + (xp - xps[i-1]) / (xps[i] - xps[i-1]);
      }
    }
  }
}