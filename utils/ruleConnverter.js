// ruleConverter.js
function convertRuleToMongoQuery(rule) {
  if (!rule.operator) {
    // single condition
    const field = rule.field;
    const comp = rule.comparator;
    const value = isNaN(rule.value) ? rule.value : Number(rule.value);

    switch (comp) {
      case '>': return { [field]: { $gt: value } };
      case '>=': return { [field]: { $gte: value } };
      case '<': return { [field]: { $lt: value } };
      case '<=': return { [field]: { $lte: value } };
      case '==': return { [field]: value };
      case '!=': return { [field]: { $ne: value } };
      default: throw new Error(`Unsupported comparator: ${comp}`);
    }
  } else {
    // group condition
    const mongoOperator = rule.operator === 'AND' ? '$and' : '$or';
    const subQueries = rule.rules.map(convertRuleToMongoQuery);
    return { [mongoOperator]: subQueries };
  }
}

module.exports = { convertRuleToMongoQuery };
