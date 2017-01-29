# lang-gen
This will collect all your JSON files and generate one simple files for the i18n build purpose.

This is the step:
```
const path = require('path');
const gen = require('lang-gen');

gen('**/lang.json', __dirname, path.join(__dirname, 'locale'));
```

This will collect all your lang.json file and generate simple one file according to the language.

First parameter is your file's pattern.
Second parameter is the root of your path to start collect.
Third parameter is the target folder to save the i18n files.

Your lang.json should like follows:
```
{
  "zh-CN": {
    "confirm": "确认",
    "or": "或",
    "reset": "重置"
  },
  "en": {
    "confirm": "Confirm",
    "or": "OR",
    "reset": "Reset"
  }
}
```

The generated file should look like this:
1. zh-CN.lang.json:
```
{"confirm":"确认","or":"或","reset":"重置"}
```
2. en.lang.json:
{"confirm":"Confirm","or":"OR","reset":"Reset"}
