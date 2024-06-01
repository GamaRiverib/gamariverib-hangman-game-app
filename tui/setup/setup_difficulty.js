/// @ts-check

const { magenta, bold, gray, yellow } = require("colors");
const { HangmanGame, Difficulty } = require("@gamariverib/hangman-game-lib");
const { KeywordsTuiComponent } = require("../keyword");

const difficulties = ["Fácil", "Normal", "Díficil"];

class SetupDifficultyTuiComponent {
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

    if (this.#game.difficulty !== undefined) {
      this.#selected = this.#game.difficulty;
      this.#done = true;
    }
  }

  print() {
    if (this.#done) {
      const difficulty = difficulties[this.#game.difficulty ? this.#game.difficulty : 0];
      console.log(`${magenta("Nivel: ")}${yellow(difficulty)}`);
    } else {
      console.log(magenta("Seleccionar nivel de dificultad: "));
      difficulties.forEach((difficulty, index) => {
        if (index === this.#selected) {
          console.log(bold(`  ${index + 1}) ${difficulty}`));
        } else {
          console.log(gray(`  ${index + 1}) ${difficulty}`));
        }
      });
      console.log();
      this.#keys.clear();
      this.#keys.addOption("Up", " Mover arriba ");
      this.#keys.addOption("Down", " Mover abajo ");
      this.#keys.addOption("Enter", " Seleccionar ");
      this.#keys.addOption("Left", " Regresar ");
      this.#keys.addOption("Right", " Terminar ");
      this.#keys.print();
    }
  }

  /**
   * @param {import("../..").KeypressEvent} key
   */
  update(key) {
    switch (key.name) {
      case "down":
        if (this.#selected >= 3) {
          this.#selected = 0;
        } else {
          this.#selected += 1;
        }
        break;
      case "up":
        if (this.#selected <= 0) {
          this.#selected = Difficulty.Hard;
        } else {
          this.#selected -= 1;
        }
        break;
      case "return":
      case "right":
        const difficulty =
          this.#selected === 0
            ? Difficulty.Easy
            : this.#selected === 1
            ? Difficulty.Normal
            : Difficulty.Hard;
        this.#game.setDifficulty(difficulty);
        this.#done = true;
        break;
      case "left":
        this.#done = false;
        break;
      default:
        console.log(key);
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

module.exports = { SetupDifficultyTuiComponent };
