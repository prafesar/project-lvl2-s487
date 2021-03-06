import _ from 'lodash';

const tabSize = 4;
const indent = level => ' '.repeat(level * tabSize);

const stringify = (inValue, level) => {
  if (!_.isObject(inValue)) {
    return inValue;
  }
  const indentLevel = indent(level + 1);
  const indentBrackets = indent(level);
  const entries = Object.entries(inValue);
  const result = entries.map(([key, value]) => `${indentLevel}${key}: ${stringify(value, level + 1)}`);
  return `{\n${result.join('\n')}\n${indentBrackets}}`;
};

const renderDiffToTree = (ast, level = 0) => {
  const renderLeafNode = (levl, mark, key, value) => `${indent(levl)}  ${mark} ${key}: ${stringify(value, levl + 1)}`;
  const renderTreeNode = (levl, key, children) => `${indent(levl)}    ${key}: ${renderDiffToTree(children, levl + 1)}`;

  const renderAction = {
    removed: ({ key, valueBefore }, nodeLevel) => renderLeafNode(nodeLevel, '-', key, valueBefore),
    added: ({ key, valueAfter }, nodeLevel) => renderLeafNode(nodeLevel, '+', key, valueAfter),
    nested: ({ key, children }, nodeLevel) => renderTreeNode(nodeLevel, key, children),
    updated: ({ key, valueBefore, valueAfter }, nodeLevel) => {
      const before = renderLeafNode(nodeLevel, '-', key, valueBefore);
      const after = renderLeafNode(nodeLevel, '+', key, valueAfter);
      return [before, after];
    },
    unchanged: ({ key, valueAfter }, nodeLevel) => renderLeafNode(nodeLevel, ' ', key, valueAfter),
  };

  const result = _.flatten(ast
    .map(node => renderAction[node.type](node, level)));

  return `{\n${result.join('\n')}\n${indent(level)}}`;
};

export default renderDiffToTree;
