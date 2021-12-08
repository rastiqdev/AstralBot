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
  
        if (player.achievements.bedwars_level) {
          canvas.print(Quantify_50_white, 158, 20, `Niveau ${player.achievements.bedwars_level}`);
        }
        if (player.stats.Bedwars.kills_bedwars) {
          canvas.print(Quantify_20_white, 158, 77, `Total de ${player.stats.Bedwars.kills_bedwars} kills`);
        }
        if (player.stats.Bedwars.deaths_bedwars) {
          canvas.print(Quantify_20_white, 158, 105, `Total de ${player.stats.Bedwars.deaths_bedwars} morts`);
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