import { visit } from 'unist-util-visit';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toFa = (value) => value.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

function skipElement(node) {
  if (!node || !node.name) return false;
  if (node.name === 'Ltr' || node.name === 'Code' || node.name === 'Num') return true;
  for (const attr of node.attributes || []) {
    if (attr.type === 'mdxJsxAttribute' && attr.name === 'digits' && attr.value === 'latin') {
      return true;
    }
  }
  return false;
}

function isSkipped(parent) {
  if (!parent) return false;
  if (parent.type === 'code' || parent.type === 'inlineCode') return true;
  if (parent.type === 'element' && (parent.tagName === 'code' || parent.tagName === 'pre')) return true;
  if (parent.type === 'mdxJsxFlowElement' || parent.type === 'mdxJsxTextElement') {
    return skipElement(parent);
  }
  return false;
}

/**
 * Converts Latin digits to Persian digits in MDX prose text nodes.
 * Skips code, inline code, <Ltr>, <Code>, <Num>, and any subtree with digits="latin".
 */
export default function remarkPersianDigits() {
  return (tree) => {
    visit(tree, (node, _index, parent) => {
      if (node.type === 'code' || node.type === 'inlineCode') return 'skip';
      if (node.type === 'element' && (node.tagName === 'code' || node.tagName === 'pre')) return 'skip';
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        if (skipElement(node)) return 'skip';
        return;
      }
      if (node.type === 'text' && !isSkipped(parent)) {
        node.value = toFa(node.value);
      }
    });
  };
}
