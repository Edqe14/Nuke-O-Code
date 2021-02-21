const WholesomeList = require('./wholesomelist.js');

// Operations
// : contains
// !: not contains
// >= above or equal
// <= below or equal
// > above
// < below
// ! is none/empty
// !! is not none/empty
const CATCHER = /(tier|title|link|author|pages|warning|parodies|tags)(:|=|>=|<=|!=|>|<|!:|!|!!)(.*)?/;

module.exports = {
  filter (input, list) {
    input = WholesomeList.cleanFilter(module.exports.parse(input));
    if (!input) return [];
    return list.filter(l => {
      let valid = true;
      for (const filt of input) {
        const operator = WholesomeList.operationRunners[filt.operation];
        if (!operator) return false;

        valid = operator(
          filt.category === 'tier'
            ? Object.values(WholesomeList.ratings).indexOf(l[filt.category])
            : l[filt.category]
          ,
          filt.category === 'tier'
            ? Object.values(WholesomeList.ratings).indexOf(filt.value[0].toUpperCase())
            : filt.category === 'warning'
              ? filt.value[0]
              : filt.value
        ) && valid;
      }

      return valid;
    });
  },
  parse (input) {
    if (typeof input !== 'string' && !Array.isArray(input)) return;
    const a = Array.isArray(input) ? input : input.split(' ');
    if (a.length === 0) return;

    const valid = [];
    for (const inp of a) {
      const parse = CATCHER.exec(inp);
      if (!parse) continue;

      const [input, category, operation, value] = parse;
      valid.push({
        input,
        category,
        operation,
        value: value?.split('|').map(v => v.replace(/_/gm, ' ')) ?? []
      });
    }

    return valid;
  }
};
