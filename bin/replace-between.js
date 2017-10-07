#!/usr/bin/env node
const path           = require('path');
const yarganout      = require('yargonaut');
const yargs          = require('yargs');
const chalk          = require('chalk');
const replaceBetween = require('../index');

const errorStyle       = 'red';
const cmd              = path.parse(__filename).name;
const { commentTypes } = replaceBetween;

yarganout
  .helpStyle('green')
  .errorsStyle(errorStyle);

// eslint-disable-next-line prefer-destructuring
const argv = yargs
  .usage('Usage: $0 [options]\n\nReplaces text between markers with text from a file or stdin.')
  .help()
  .example('', `${cmd} --target README.md --token 'API DOC'\nReplaces text between `
            + `${chalk.yellow('<!--- API DOC BEGIN --->')} and ${chalk.yellow('<!--- API DOC END --->')} in README.md with `
            + 'contents of input read from STDIN. ')
  .options({
    n: {
      alias:    'token',
      type:     'string',
      require:  true,
      describe: 'Token text to look for between start and end comment. BEGIN and END words are added automatically.',
    },
    t: {
      alias:    'target',
      type:     'string',
      require:  true,
      describe: 'Target file to replace text in.',
    },
    s: {
      alias:    'source',
      type:     'string',
      describe: 'Source file to get replacement text from. If not provided STDIN is used instead.',
    },
    c: {
      alias:    'comment',
      choices:  Object.keys(commentTypes),
      type:     'string',
      describe: "Predefined comment types to be used for replacement markers. (i.e. 'markdown' for"
                + "'<!---'  '--->'. If not provided, it is tried to be get from target file extension.",
    },
    b: {
      alias:    'begin',
      type:     'string',
      describe: 'Beginning of the comment syntax. i.e <!--- for markdown.',
    },
    e: {
      alias:    'end',
      type:     'string',
      describe: 'End of the comment syntax. i.e ---> for markdown.',
    },

  })
  .check((args) => {
    /* eslint no-param-reassign: "off" */
    if (!(args.comment || args.begin)) {
      // Try to get get commennt typr from file extension.
      const fileExtension = path.parse(args.target).ext.replace('.', '');
      if (commentTypes[fileExtension]) {
        args.comment = fileExtension;
      } else {
        return chalk[errorStyle]('I cannot get comment type from file extension. Either --comment or --begin options should be provided.');
      }
    }
    return true;
  })
  .argv;

/* eslint no-console: "off" */
replaceBetween(argv)
  .catch((error) => {
    yargs.showHelp('log');
    console.error(chalk[errorStyle](error));
    process.exit(1);
  });
