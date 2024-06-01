const { gray, grey, bgWhite, bold } = require("colors");

class KeywordsTuiComponent {
  options = [];
  constructor() {}

  addOption(key, text) {
    this.options.push({ key, text });
  }

  clear() {
    this.options = [];
  }

  print() {
    const [, rows] = process.stdout.getWindowSize();
    process.stdout.cursorTo(0, rows - 1);
    this.options.forEach((option) => {
      const text = `${bold(gray(option.key))}: ${bgWhite(grey(option.text))}  `;
      process.stdout.write(text);
    });
  }
}

module.exports = { KeywordsTuiComponent };
