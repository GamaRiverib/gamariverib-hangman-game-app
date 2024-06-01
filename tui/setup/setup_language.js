/// @ts-check

const { magenta, bold, gray, yellow, green } = require("colors");
const { HangmanGame } = require("@gamariverib/hangman-game-lib");
const { KeywordsTuiComponent } = require("../keyword");

const languages = {
  es: "Español",
  en: "Inglés",
};

class SetupLanguageTuiComponent {
  /**
   * @type {HangmanGame}
   */
  #game;

  /**
   * @type {number}
   */
  #selected = 0;

  /**
   * @type {boolean}
   */
  #done = false;

  /**
   * @type {KeywordsTuiComponent}
   */
  #keys;

  /**
   * Constructor de la clase SetupTuiComponent
   * @param {HangmanGame} game Juego
   */
  constructor(game) {
    /**
     * @type {HangmanGame}
     */
    this.#game = game;
    this.#keys = new KeywordsTuiComponent();

    if (this.#game.language) {
      const index = this.#game.languages.indexOf(this.#game.language);
      if (index >= 0) {
        this.#selected = index;
        this.#done = true;
      }
    }
  }

  print() {
    if (this.#done) {
      console.log(`${magenta("Idioma: \t")}${yellow(languages[this.#game.language])}`);
    } else {
      const availableLanguages = this.#game.languages;
      console.log(magenta("Seleccionar un idioma: "));
      availableLanguages.forEach((l, index) => {
        if (index === this.#selected) {
          console.log(`  ${green("\u25C9")} ${languages[l]}`);
        } else {
          console.log(`  \u25CE ${languages[l]}`);
        }
      });
      console.log();
      this.#keys.clear();
      this.#keys.addOption("Up", " Mover arriba ");
      this.#keys.addOption("Down", " Mover abajo ");
      this.#keys.addOption("Enter", " Seleccionar ");
      this.#keys.print();
    }
  }

  /**
   * @param {import("../..").KeypressEvent} key
   */
  update(key) {
    switch (key.name) {
      case "down":
        if (this.#selected >= this.#game.languages.length - 1) {
          this.#selected = 0;
        } else {
          this.#selected += 1;
        }
        break;
      case "up":
        if (this.#selected <= 0) {
          this.#selected = this.#game.languages.length - 1;
        } else {
          this.#selected -= 1;
        }
        break;
      case "return":
      case "right":
        const language = this.#game.languages[this.#selected];
        this.#game.setLanguage(language);
        this.#done = true;
        break;
    }
  }

  change() {
    this.#done = false;
  }

  /**
   * @type {boolean}
   */
  get isDone() {
    return this.#done;
  }
}

module.exports = { SetupLanguageTuiComponent };
