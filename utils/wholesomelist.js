const get = require('miniget');

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
      0: 'S',
      1: 'S-',
      2: 'A+',
      3: 'A',
      4: 'A-',
      5: 'B+',
      6: 'B',
      7: 'B-',
      8: 'C+',
      9: 'C',
      10: 'C-',
      11: 'D+',
      12: 'D',
      13: 'D-'
    };
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
