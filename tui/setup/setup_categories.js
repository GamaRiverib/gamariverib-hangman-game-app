/// @ts-check

const { magenta, bold, gray, green, yellow } = require("colors");
const { HangmanGame } = require("@gamariverib/hangman-game-lib");
const { KeywordsTuiComponent } = require("../keyword");

class SetupCategoriesTuiComponent {
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

    this.#done = this.#game.selectedCategories.length > 0;
  }

  print() {
    if (this.#done) {
      console.log(`${magenta("Palabras: ")}${yellow(this.#game.availableWords + "")}`);
    } else {
      console.log(magenta("Seleccionar categorías: "));
      const allOptions =
        this.#game.availableCategories.length === this.#game.selectedCategories.length
          ? "Ninguna"
          : "Todas";
      const categories = [allOptions, ...this.#game.availableCategories];
      categories.forEach((category, index) => {
        const selected = this.#game.selectedCategories.includes(category) ? green("X") : " ";
        if (index === this.#selected) {
          if (index === 0) {
            console.log(bold(`  ${category}`));
          } else {
            console.log(bold(`  [${selected}] ${category}`));
          }
        } else {
          if (index === 0) {
            console.log(gray(`  ${category}`));
          } else {
            console.log(gray(`  [${selected}] ${category}`));
          }
        }
      });
      console.log();
      this.#keys.clear();
      this.#keys.addOption("Up", " Mover arriba ");
      this.#keys.addOption("Down", " Mover abajo ");
      this.#keys.addOption("Enter", " Des/Seleccionar ");
      this.#keys.addOption("Left", " Regresar ");
      this.#keys.addOption("Right", " Continuar ");
      this.#keys.print();
    }
  }

  /**
   * @param {import("../..").KeypressEvent} key
   */
  update(key) {
    switch (key.name) {
      case "down":
        if (this.#selected >= this.#game.availableCategories.length + 1) {
          this.#selected = 0;
        } else {
          this.#selected += 1;
        }
        break;
      case "up":
        if (this.#selected <= 0) {
          this.#selected = this.#game.availableCategories.length + 1;
        } else {
          this.#selected -= 1;
        }
        break;
      case "return":
        if (this.#selected === 0) {
          if (this.#game.availableCategories.length === this.#game.selectedCategories.length) {
            this.#game.availableCategories.forEach((category) => {
              this.#game.removeCategory(category);
            });
          } else {
            this.#game.availableCategories.forEach((category) => {
              this.#game.addCategory(category);
            });
          }
        } else {
          const category = this.#game.availableCategories[this.#selected - 1];
          if (this.#game.selectedCategories.includes(category)) {
            this.#game.removeCategory(category);
          } else {
            this.#game.addCategory(category);
          }
        }
        break;
      case "left":
        this.#game.setLanguage(undefined);
        break;
      case "right":
        this.#done = this.#game.selectedCategories.length >= 0;
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

module.exports = { SetupCategoriesTuiComponent };
