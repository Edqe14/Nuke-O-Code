const { nana } = require('../index.js');
const Embed = require('../utils/embed.js');

module.exports = exports = {
  name: 'random',
  description: 'Get a random doujin',
  cooldown: 8,
  args: false,
  permissions: null,
  aliases: ['r'],
  usage: '',
  nsfw: true,
  async run (bot, message, args, config) {
    const { id } = await nana.random();
    bot.commands.get('doujin').run(bot, message, [id], config);
  }
};
