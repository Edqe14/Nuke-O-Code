const { MessageEmbed } = require('discord.js');
const colours = [
  '#d40826',
  '#ec5809',
  '#ec9909',
  '#09ddec'
];

module.exports = exports.default = class Embed extends MessageEmbed {
  /*  Mode
   *  0 = nhentai
   *  1 = wholesomelist
   */
  constructor (mode = 0) {
    super();

    this.setColor(colours[Math.floor(Math.random() * colours.length)]);
    switch (mode) {
      case 0: {
        this.setAuthor('Sauces', 'https://i.imgur.com/uLAimaY.png', 'https://nhentai.net/');
        this.setFooter('Know Pleasure.');
        break;
      }

      case 1: {
        this.setAuthor('Wholesome', 'https://cdn.discordapp.com/attachments/608138102514647091/704105244581167294/6cropped.jpg', 'https://wholesomelist.com/');
        this.setFooter('Built by cultured people, for cultured people');
        break;
      }
    }
  }
};
