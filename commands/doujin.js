const { nana } = require('../index.js');
const Embed = require('../utils/embed.js');

module.exports = exports = {
  name: 'doujin',
  description: 'Get a doujin info',
  cooldown: 8,
  args: true,
  permissions: null,
  aliases: ['d', 'comic'],
  usage: '<id>',
  nsfw: true,
  category: 'nhentai',
  async run (bot, message, args, config) {
    const id = ('' + args[0] || '').match(/(\d+)/)[0]?.replace(/g\//gm, '');
    if (isNaN(id)) return message.reply('Invalid ID');

    const data = await nana.g(id);
    if (!data) return message.reply('No result');

    const embed = new Embed()
      .setDescription(`**[${data.title.japanese}](https://nhentai.net/g/${data.id})**\n\`${data.title.english}\`\n\n**ID**: ${data.id}\n**Tags**: ${data.tags.map(t => t.name).join(', ')}\n**Pages**: ${data.num_pages}`)
      .setImage(`https://t.nhentai.net/galleries/${data.media_id}/cover.jpg`);

    return message.channel.send(embed);
  }
};
