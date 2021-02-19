const Embed = require('../utils/embed.js');

module.exports = exports = {
  name: 'wholesome',
  description: 'Show wholesomelist about embed',
  cooldown: 5,
  args: false,
  permissions: null,
  aliases: ['w'],
  usage: '',
  nsfw: false,
  category: 'wholesomelist',
  async run (bot, message, args, config) {
    const wholesomeCommands = bot.commands
      .filter(c => c.category === 'wholesomelist' && c.name !== 'wholesome')
      .map((c) => `> \`${c.name.replace('wholesome ', '')}\` **-** ${c.description}`);

    const embed = new Embed(1)
      .setTitle('Welcome to the Wholesome Hentai God List!')
      .setDescription(`Here, we archive the most wholesome of hentai, tagging and tiering it for you, so you don't have to crawl through piles of NTR to find that one godly wholesome doujin.\n\n**Available subcommands**\n${wholesomeCommands.join('\n')}`);

    return message.channel.send(embed);
  }
};
