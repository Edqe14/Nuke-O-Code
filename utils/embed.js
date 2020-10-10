const { MessageEmbed } = require('discord.js');
const colours = [
  '#d40826',
  '#ec5809',
  '#ec9909',
  '#09ddec'
];

module.exports = exports.default = class Embed extends MessageEmbed {
  constructor () {
    super();
    
    this.setColor(colours[Math.floor(Math.random() * colours.length)]);
    this.setAuthor('Sauces', 'https://i.imgur.com/uLAimaY.png', 'https://nhentai.net/');
    this.setFooter('Know Pleasure.');
  }
}