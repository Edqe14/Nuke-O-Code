require('dotenv').config();

// eslint-disable-next-line no-unused-vars
const { Client, Permissions: { FLAGS } } = require('discord.js');
const { readdir } = require('fs');
const { join } = require('path');
const Collection = require('@discordjs/collection');
const NanaAPI = require('nana-api');
const fs = require('fs');

const WholesomeList = require('./utils/wholesomelist.js');
const nana = new NanaAPI();

const bot = new Client({
  disableEveryone: true
});
bot.setMaxListeners(10000);
bot.waitListPopulate = (ms = 500) => {
  return new Promise((resolve) => {
    const checker = (interval) => {
      if (bot.wholesome !== undefined) {
        if (interval) clearInterval(interval);
        resolve();
      }
    };
    const interval = setInterval(() => checker(interval), ms);
  });
};

const fetchList = async () => {
  const listPath = join(__dirname, 'cache', 'wholesome.list.json');
  const featuredPath = join(__dirname, 'cache', 'wholesome.featured.json');
  const recentPath = join(__dirname, 'cache', 'wholesome.recent.json');
  // Delete cache
  try {
    delete require.cache[require.resolve(listPath)];
    delete require.cache[require.resolve(featuredPath)];
    delete require.cache[require.resolve(recentPath)];
  } catch (e) {}

  const cacheExists =
    fs.existsSync(listPath) &&
    fs.existsSync(featuredPath) &&
    fs.existsSync(recentPath);
  let outdated = false;
  let listCache, featuredCache, recentCache;
  if (cacheExists) {
    listCache = require(listPath);
    featuredCache = require(featuredPath);
    recentCache = require(recentPath);
    if (
      Date.now() - listCache.createdAt >= 24 * 60 * 60 * 1000 ||
      Date.now() - featuredCache.createdAt >= 24 * 60 * 60 * 1000 ||
      Date.now() - recentCache.createdAt >= 24 * 60 * 60 * 1000
    ) outdated = true;
    else console.log('Populate using cached files');
  } else console.log('Fetching data...');

  const [list, featured, recent] = (cacheExists && !outdated
    ? [
        listCache.data,
        featuredCache.data,
        recentCache.data
      ]
    : await Promise.all([
      WholesomeList.fetchList(),
      WholesomeList.fetchFeatured(),
      WholesomeList.fetchRecent()
    ]));

  if (!cacheExists || outdated) {
    fs.writeFileSync(listPath, JSON.stringify({ createdAt: Date.now(), data: list }));
    fs.writeFileSync(featuredPath, JSON.stringify({ createdAt: Date.now(), data: featured }));
    fs.writeFileSync(recentPath, JSON.stringify({ createdAt: Date.now(), data: recent }));
    console.log('Written wholesomelist cache files');
  }

  bot.wholesome = {
    list: (list || { table: [] }).table,
    featured: (featured || { table: [] }).table,
    recent: (recent || { table: [] }).table
  };

  console.log('List populated!');
  setTimeout(fetchList, 24 * 60 * 60 * 1000 + 60000);
};
fetchList();

module.exports.nana = exports.nana = nana;

const config = bot.config = require('./config.json');

/**
 * @typedef Command
 * @property {string} name Command name
 * @property {string} description Command description
 * @property {number} cooldown Command cooldown in seconds
 * @property {boolean} args Use arguments
 * @property {FLAGS[]} permission Command permission
 * @property {string[]} aliases Command alias
 * @property {string} usage Command usage
 * @property {boolean} nsfw NSFW command
 * @property {function} run Command runner
 */

/**
 * @type {Collection<string, Command>}
 */
const commands = bot.commands = new Collection();
const cooldowns = bot.cooldowns = new Collection();
readdir(join(__dirname, 'commands'), (e, f) => {
  if (e) throw e;
  const js = f.filter((f) => f.split('.').pop() === 'js');

  if (js.length <= 0) return console.log('No commands is available to load...');
  console.log(`Loading ${js.length} commands...`);
  js.forEach((fi, i) => {
    const c = require(join(__dirname, 'commands', fi));

    console.log(`${i + 1}: ${fi} loaded!`);
    commands.set(c.name, c);
  });
});

readdir(join(__dirname, 'handlers'), (e, files) => {
  if (e) throw e;

  const handlers = files.filter(f => f.split('.').pop() === 'js');
  if (handlers.length <= 0) return console.log('There are no handlers to load...');

  console.log(`Loading ${handlers.length} handlers...`);
  handlers.forEach((f, i) => {
    require(join(__dirname, 'handlers', f))(bot, config, cooldowns);
    console.log(`${i + 1}: ${f} loaded!`);
  });
});

const token = process.env.NODE_ENV === 'development' && process.env.DEV_TOKEN ? process.env.DEV_TOKEN : process.env.TOKEN;
bot.login(token)
  .catch(console.error)
  .then(() => console.log(`Logged in as ${bot.user.username}#${bot.user.discriminator}`));
