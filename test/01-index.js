const Code      = require('code');

const { expect }      = Code;

const { exec }        = require('mz/child_process');
const fcmp            = require('fcmp');
const fs              = require('fs-promise');
const path            = require('path');
const replaceBetween  = require('../index');

const sampleFile            = path.join(__dirname, './test-material/sample-readme.md');
const targetFile            = path.join(__dirname, './test-material/readme.md');
const expectedFile          = path.join(__dirname, './test-material/expected.md');
const expectedFile2         = path.join(__dirname, './test-material/expected-2.md');
const apiFile               = path.join(__dirname, './test-material/sample-api.md');
const emptyFile             = path.join(__dirname, './test-material/empty.md');
const unknownExtensionFile  = path.join(__dirname, './test-material/unknown-extension.ext');

/* eslint comma-dangle: "off" */

describe('replace-between', () => {
  beforeEach(() => fs.copy(sampleFile, targetFile));
  after(() => fs.remove(targetFile));

  it('should replace text from file', () =>
    replaceBetween({
      source:  apiFile,
      target:  targetFile,
      token:   'API DOC',
      comment: 'md'
    })
      .then(() => fcmp(targetFile, expectedFile))
      .then(comparison => expect(comparison).to.be.true()));

  it('should throw error for empty stdin', () =>
    replaceBetween({
      target:  targetFile,
      token:   'API DOC',
      comment: 'md'
    })
      .catch(error => expect(error.message).to.be.equal('Source content is empty.')));

  it('should replace text from file for begin and end markers.', () =>
    replaceBetween({
      source: apiFile,
      target: targetFile,
      token:  'API DOC',
      begin:  '<!---',
      end:    '--->'
    })
      .then(() => fcmp(targetFile, expectedFile))
      .then(comparison => expect(comparison).to.be.true()));

  it('should throw error for empty content', () =>
    replaceBetween({
      source: emptyFile,
      target: targetFile,
      token:  'API DOC',
      begin:  '<!---',
      end:    '--->'
    })
      .catch(error => expect(error.message).to.be.equal('Source content is empty.')));

  it('should throw error for missing token', () =>
    replaceBetween({
      source: apiFile,
      target: targetFile,
      token:  'API DOC',
      begin:  '<!!!!!!!',
      end:    '!!!!!!>'
    })
      .catch(error => expect(error.message).to.startWith('Target file content does not have necessary tokens')));
});

describe('replace-between CLI', () => {
  beforeEach(() => fs.copy(sampleFile, targetFile));
  after(() => fs.remove(targetFile));

  it('should throw exception for unknown file types.', () =>
    exec(`node bin/replace-between -s ${apiFile} -t ${unknownExtensionFile} -n 'API DOC'`)
      .catch(error => expect(error.message).to.contains('I cannot get comment type from file extension')));

  it('should throw exception for not found files.', () =>
    exec(`node bin/replace-between -s ./non-exists.md -t ${targetFile} -n 'API DOC'`)
      .catch(error => expect(error.message).to.contains('ENOENT: no such file or directory')));

  it('should use comment option', () =>
    exec(`node bin/replace-between -s ${apiFile} -t ${targetFile} -c md -n 'API DOC'`)
      .then(() => fcmp(targetFile, expectedFile))
      .then(comparison => expect(comparison).to.be.true()));

  it('should replace text from file', () =>
    exec(`node bin/replace-between -s ${apiFile} -t ${targetFile} -n 'API DOC'`)
      .then(() => fcmp(targetFile, expectedFile))
      .then(comparison => expect(comparison).to.be.true()));

  it('should replace text from stdin', () =>
    exec(`echo Hello | node bin/replace-between -t ${targetFile} -n 'API DOC'`)
      .then(() => fcmp(targetFile, expectedFile2))
      .then(comparison => expect(comparison).to.be.true()));
});
