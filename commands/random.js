const { nana } = require('../index.js');

module.exports = exports = {
  name: 'random',
  description: 'Get a random doujin',
  cooldown: 8,
  args: false,
  permissions: null,
  aliases: ['r'],
  usage: '',
  nsfw: true,
  category: 'nhentai',
  async run (bot, message, args, config) {
    const { id } = await nana.random();
    bot.commands.get('doujin').run(bot, message, [id], config);
  }
};
