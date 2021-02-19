const Embed = require('../utils/embed.js');

const NH_ID = /(\d+)/;

module.exports = exports = {
  name: 'wholesome random',
  description: 'Get a random doujin from the list',
  cooldown: 5,
  args: false,
  permissions: null,
  aliases: ['wr'],
  usage: '',
  nsfw: false,
  category: 'wholesomelist',
  async run (bot, message, args, config) {
    await bot.waitListPopulate();

    const random = bot.wholesome.list[Math.floor(Math.random() * bot.wholesome.list.length)];

    const embed = new Embed(1)
      .setDescription(`**[${random.title}](${random.link})** by **${random.author}**\n\n**ID**: ${(random.link.match(NH_ID) || [])[0]}\n**Tags**: ${random.tags.length === 0 ? 'N/A' : random.tags.join(', ')}\n**Pages**: ${random.pages}\n**Tier**: ${random.tier}\n${random.warning ? `**Warning**: \`${random.warning || 'None'}` : ''}\``)
      .setImage(random.image);

    return message.channel.send(embed);
  }
};
