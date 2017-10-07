const path      = require('path');
const chalk     = require('chalk');
const fs        = require('fs-extra');
const getStdin  = require('get-stdin');

const commentTypes = {
  md:   { begin: '<!---', end: '--->' },
  js:   { begin: '/\\*', end: '\\*/' },
  html: { begin: '<!--', end: '-->' },
};

/**
 * Replaces text between markers with text from a file or stdin.
 * @param   {Object}          args            - Options
 * @param   {string}          args.token      - Token text to look for between start and end comment. BEGIN and END words are added automatically.
 * @param   {string}          args.target     - Target file to replace text in.
 * @param   {string}          [args.source]   - Source file to get replacement text from. If not provided STDIN is used instead.
 * @param   {string}          [args.comment]  - Predefined comment types to be used for replacement markers. (i.e. 'markdown' for '<!---'  '--->'. If not provided, it is tried to be get from target file extension.
 * @param   {string}          [args.begin]    - Beginning of the comment syntax. i.e <!--- for markdown.
 * @param   {string}          [args.end]      - End of the comment syntax. i.e ---> for markdown.
 * @returns {Promise.<void>}                  - Promise
 */
function replaceBetween(args) {
  const getSourceContent  = args.source ? fs.readFile(path.normalize(args.source), { encoding: 'utf8' }) : getStdin();
  const getTargetContent  = fs.readFile(path.normalize(args.target), { encoding: 'utf8' });
  const commentBegin      = args.comment ? commentTypes[args.comment].begin : args.begin;
  const commentEnd        = args.comment ? commentTypes[args.comment].end : args.end;

  const beginTokenPattern = `(${commentBegin}\\s*?${args.token} BEGIN\\s*?${commentEnd}.*?[\\r\\n]+)`;
  const endTokenPattern   = `(${commentBegin}\\s*?${args.token} END\\s*?${commentEnd})`;
  const contentPattern    = '[\\s\\S]*?';

  const RX = new RegExp(`${beginTokenPattern}${contentPattern}${endTokenPattern}`, 'm');

  return Promise.all([getSourceContent, getTargetContent])
    .then(([sourceContent, targetContent]) => {
      if (!sourceContent) {
        throw new Error('Source content is empty.');
      }

      if (!targetContent.match(RX)) {
        const error = `Target file content does not have necessary tokens ${chalk.yellow(`${commentBegin} ${args.token} BEGIN ${commentEnd}`)} `
          + `and ${chalk.yellow(`${commentBegin} ${args.token} END ${commentEnd}`)}.`;
        throw new Error(error);
      }

      return targetContent.replace(RX, `$1${sourceContent}$2`);
    })
    .then(newContent => fs.outputFile(path.normalize(args.target), newContent));
}

module.exports = replaceBetween;
module.exports.commentTypes = commentTypes;

