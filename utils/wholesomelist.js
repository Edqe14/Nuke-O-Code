const get = require('miniget');
const capitalize = require('./capitalize.js');

module.exports = class WholesomeList {
  static get baseURL () {
    return 'https://wholesomelist.com';
  }

  static get endpoints () {
    return {
      list: '/api/list',
      featured: '/api/features',
      recent: '/api/updates',
      check: '/api/check'
    };
  }

  static get ratings () {
    return {
      13: 'S',
      12: 'S-',
      11: 'A+',
      10: 'A',
      9: 'A-',
      8: 'B+',
      7: 'B',
      6: 'B-',
      5: 'C+',
      4: 'C',
      3: 'C-',
      2: 'D+',
      1: 'D',
      0: 'D-'
    };
  }

  static get validTags () {
    return [
      'Anal', 'Childhood Friend', 'Chubby',
      'College', 'Couple', 'Coworker',
      'Dark Skin', 'Demon Girl', 'Elf',
      'Femdom', 'Flat Chested', 'Full Color',
      'Futanari', 'Gender Bender', 'Ghost Girl',
      'Group', 'Gyaru', 'Handholding',
      'High School', 'Kemonomimi', 'Kuudere',
      'Maid', 'Milf', 'Monster Boy',
      'Monster Girl', 'Parents', 'Robot Girl',
      'Short', 'Shy', 'Tall',
      'Teacher', 'Tomboy', 'Tsundere',
      'Uncensored', 'Yuri', 'Yaoi'
    ];
  }

  static get operations () {
    const string = ['=', ':', '!:', '!', '!!'];
    string.type = 'string';

    const number = ['=', '>=', '<=', '>', '<'];
    number.type = 'number';

    return {
      string,
      number
    };
  }

  static get operationRunners () {
    return {
      ':': WholesomeList.contains,
      '!:': WholesomeList.notContains,
      '!': WholesomeList.isNone,
      '!!': WholesomeList.isNotNone,
      '=': WholesomeList.isEqual,
      '>=': WholesomeList.isAboveOrEqual,
      '<=': WholesomeList.isBelowOrEqual,
      '>': WholesomeList.isAbove,
      '<': WholesomeList.isBelow
    };
  }

  static contains (value, test) {
    if (Array.isArray(test)) return test.some(t => value?.includes(t));
    return value?.includes(test);
  }

  static notContains (value, test) {
    return !WholesomeList.contains(value, test);
  }

  static isNone (value) {
    return value === '' || value === 'None' || value?.length === 0;
  }

  static isNotNone (value) {
    return !WholesomeList.isNone(value);
  }

  static isEqual (value, test) {
    if (Array.isArray(value) && Array.isArray(test)) {
      if (value.length === 0 && test.length === 0) return true;
      if (value.length === 0 && test.length !== 0) return false;
      return value.filter(t => !test.includes(t)).length === 0;
    }
    return value === test;
  }

  static isAboveOrEqual (value, test) {
    return value >= test;
  }

  static isBelowOrEqual (value, test) {
    return value <= test;
  }

  static isAbove (value, test) {
    return value > test;
  }

  static isBelow (value, test) {
    return value > test;
  }

  static get validOperations () {
    return {
      title: WholesomeList.operations.string,
      link: WholesomeList.operations.string,
      author: WholesomeList.operations.string,
      tier: WholesomeList.operations.number,
      pages: WholesomeList.operations.number,
      warning: WholesomeList.operations.string,
      parodies: WholesomeList.operations.string,
      tags: WholesomeList.operations.string
    };
  }

  static cleanFilter (array) {
    if (!array || !Array.isArray(array)) return;

    const cleaned = [];
    for (const inp of array) {
      const { category, operation, value } = inp;
      if (!category || !operation || !value) continue;

      const validOperation = WholesomeList.validOperations[category.toLowerCase()];
      if (!validOperation || !validOperation?.includes(operation)) continue;
      if (!(['!', '!!'].includes(operation)) && !value) continue;

      switch (category) {
        case 'tags': {
          inp.value = inp.value.map(v => capitalize(v)).filter(t => WholesomeList.validTags.includes(t));
          if (inp.value.length === 0) continue;
          break;
        }

        case 'tier': {
          inp.value[0] = inp.value[0].toUpperCase();
          if (!Object.values(WholesomeList.ratings).includes(inp.value[0])) continue;
          break;
        }

        default: break;
      }

      cleaned.push(inp);
    }

    return cleaned;
  }

  static fetch (url) {
    if (!url) return;
    return get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
      }
    });
  }

  static fetchList () {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const list = JSON.parse(await WholesomeList.fetch(WholesomeList.baseURL + WholesomeList.endpoints.list).text());
          resolve(list);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  static fetchFeatured () {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const featured = JSON.parse(await WholesomeList.fetch(WholesomeList.baseURL + WholesomeList.endpoints.featured).text());
          resolve(featured);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  static fetchRecent () {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const recent = JSON.parse(await WholesomeList.fetch(WholesomeList.baseURL + WholesomeList.endpoints.recent).text());
          resolve(recent);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }

  static check (id) {
    return new Promise((resolve, reject) => {
      if (!id || typeof id !== 'string') return reject(new Error('Invalid ID'));
      (async () => {
        try {
          const page = JSON.parse(await get(WholesomeList.baseURL + WholesomeList.endpoints.check + `?check=${id}`).text());
          resolve(page);
        } catch (e) {
          reject(e);
        }
      })();
    });
  }
};
