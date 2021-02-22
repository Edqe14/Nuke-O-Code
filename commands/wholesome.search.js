const Embed = require('../utils/embed.js');
const { filter } = require('../utils/filter.js');
const paginate = require('../utils/paginate.js');
const Reactions = [
  '◀',
  '▶',
  '❌'
];

module.exports = exports = {
  name: 'wholesomesearch',
  description: 'Filter out wholesomelist using queriess',
  cooldown: 5,
  args: true,
  permissions: null,
  aliases: ['ws'],
  usage: '<query|"help">',
  nsfw: true,
  category: 'wholesomelist',
  async run (bot, message, args, config) {
    await bot.waitListPopulate();

    const embed = new Embed(1);
    if (args[0] === 'help') {
      embed.setTitle('Search Query Help')
        .setDescription('This command is for filtering the output from wholesomelist')
        .addFields([
          {
            name: 'Available Category',
            value: ['title', 'author', 'link', 'pages', 'warning', 'tier', 'parodies', 'tags'].map(p => `> \`${p}\``).join('\n'),
            inline: true
          },
          {
            name: 'Available Operations',
            value: [
              '**`:`** Contains',
              '**`!:`** Not Contains',
              '**`!`** Is None',
              '**`!!`** Is Not None',
              '**`>=`** Is Above or Equal',
              '**`<=`** Is Below or Equal',
              '**`>`** Is Above',
              '**`<`** Is Below or Equal'
            ].map(o => `> ${o}`).join('\n'),
            inline: true
          },
          {
            name: 'Filter Examples',
            value: '> Use `|` to split between tags\n> Use `_` instead of space\n\n```\ntier>=A tags:handholding|couple\ntier>B tags=yuri\ntier>B+ tags:couple warning!```'
          }
        ]);
      return message.channel.send(embed);
    }

    const parsed = filter(args, bot.wholesome.list).slice(0, 50);
    let i = 1;
    let max;

    const msg = await update();
    Reactions.every(async r => {
      await msg.react(r);
    });

    const collector = msg.createReactionCollector((r, u) => Reactions.includes(r.emoji.name) && u.id === message.author.id, { idle: 60000 });
    collector.on('collect', (r, u) => {
      r.users.remove(u);
      if (r.emoji.name === '❌') return collector.stop();
      if (r.emoji.name === '▶' && !(i + 1 > max)) i++;
      else if (r.emoji.name === '◀' && !(i - 1 < 1)) i--;
      if (i > max || i < 1) return;
      update(msg);
    });

    collector.on('end', () => {
      msg.reactions.removeAll();
    });

    async function update (m) {
      const page = paginate(parsed, i);
      if (!max) max = page.maxPage;

      const desc = page.items.map((d, ii) => `**\`${((i - 1) * 10 + ii + 1).toString().padStart(2, '0')}.\`** **[${d.title}](${d.link})** by **${d.author}** \`${d.tier}\` ${d.tags.length !== 0 ? `\`${d.tags.join(', ')}\`` : ''} ${d.warning !== 'None' ? `*Warning(s) \`${d.warning}\`*` : ''}`);
      embed.setDescription(desc.join('\n') + `\n\nPage ${page.page} of ${page.maxPage}`);

      if (!m) return await message.channel.send(embed);
      return await m.edit(embed);
    }
  }
};
