"use strict";

const fs = require('fs');
const glob = require('glob');
const path = require('path');

function buildJsonIndex(files, root, output) {
  var invertedIndexes = {};

  files.forEach(file => {
    try {
      const content = require(path.join(root, file));
      const languages = Object.keys(content);
      languages.forEach((lang) => {
        const obj = content[lang];
        if (typeof invertedIndexes[lang] === 'undefined') {
          invertedIndexes[lang] = {
            words: [],
            docIndex: {}
          };
          output[lang] = {};
        }
        const invertedIndex = invertedIndexes[lang];
        Object.keys(obj).forEach(key => {
          if (invertedIndex.words.indexOf(key) === -1) {
            invertedIndex.words.push(key);
            invertedIndex.docIndex[key] = [file];
            output[lang][key] = obj[key];
          } else {
            invertedIndex.docIndex[key].push(file);
          }
        });
      });
    } catch (e) {
      // Do nothing if it is invalid JSON.
    }
  });
  Object.keys(invertedIndexes).forEach(k => {
    const invertedIndex = invertedIndexes[k];
    invertedIndex.words.forEach(function(word) {
      var dupCount = invertedIndex.docIndex[word].length;
      if (dupCount > 1) {
        console.log(` WARNING the key ${word} is duplicate in ${dupCount} files: `);
      }
    });
  });
}

function writeFile(fileName, str) {

  try {
    fs.writeFileSync(fileName, str, 'utf-8');
  } catch (e) {
    throw new Error(`ERROR Fail to write i18n file ${fileName}`);
  }
}

module.exports = function(pattern, root, outputPath) {
  // Check the outputPath
  try {
    fs.accessSync(outputPath, fs.F_OK);
  } catch (e) {
    try {
      fs.mkdirSync(outputPath);
    } catch (err) {
      throw new Error(`The output path ${outputPath} is invalid!`);
    }
  }

  const files = glob.sync(pattern, {
    cwd: root,
    ignore: ['node_modules/**/*.*']
  });
  const output = {};
  buildJsonIndex(files, root, output);

  Object.keys(output).forEach(lang => {
    const fileName = `${lang}.lang.json`;
    writeFile(path.join(outputPath, fileName), JSON.stringify(output[lang]));
  });
};
