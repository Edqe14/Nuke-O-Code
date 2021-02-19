const { nana } = require('../index.js');
const Embed = require('../utils/embed.js');
const Reactions = [
  '◀',
  '▶',
  '📃',
  '❌'
];

module.exports = exports = {
  name: 'search',
  description: 'Search a keyword',
  cooldown: 8,
  args: true,
  permissions: null,
  aliases: ['s'],
  usage: '<query>',
  nsfw: true,
  category: 'nhentai',
  async run (bot, message, args, config) {
    const query = args.join(' ');
    if (!query || query.length === 0) return message.reply('Invalid query');

    const list = await nana.search(query);
    if (list.results.length === 0) return message.reply('Nothing was found :(');

    const top10 = list.results.slice(0, 10);
    let i = 0;

    const embed = new Embed();
    const msg = await update();
    Reactions.every(async r => {
      await msg.react(r);
    });

    const collector = msg.createReactionCollector((r, u) => Reactions.includes(r.emoji.name) && u.id === message.author.id, { time: 120000 });
    collector.on('collect', (r, u) => {
      r.users.remove(u);
      if (r.emoji.name === '▶') i++;
      else if (r.emoji.name === '◀') i--;
      else if (r.emoji.name === '❌') return collector.stop();
      else return all(msg);
      if (i > top10.length - 1 || i < 0) return;
      update(msg);
    });

    collector.on('end', () => {
      msg.reactions.removeAll();
    });

    async function update (m) {
      if (!top10[i]) return;
      const { tags } = await nana.g(top10[i].id);
      embed.setDescription(`${i + 1}. **[${top10[i].title}](https://nhentai.net/g/${top10[i].id})**\n**ID**: ${top10[i].id}\n**Language**: ${top10[i].language}\n**Tags**: ${tags.map(t => t.name).join(', ')}`);
      embed.setImage(top10[i].thumbnail.s);

      if (!m) return await message.channel.send(embed);
      return await m.edit(embed);
    }

    async function all (m) {
      embed.image = undefined;
      msg.reactions.removeAll();
      let prep = '';
      top10.forEach((l, ii) => {
        prep += `${ii + 1}. **[${l.title}](https://nhentai.net/g/${l.id})**\n**ID**: ${l.id}\n**Language**: ${l.language}\n\n`;
      });
      embed.setDescription(prep);
      embed.setThumbnail(top10[Math.floor(Math.random() * top10.length)].thumbnail.s);

      return await m.edit(embed);
    }
  }
};
