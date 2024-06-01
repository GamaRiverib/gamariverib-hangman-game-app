/// @ts-check

const { bold, rainbow, white } = require("colors");
const { HangmanGame } = require("@gamariverib/hangman-game-lib");
const { KeywordsTuiComponent } = require("./keyword");

class TitleTuiComponent {
  /**
   * @type {HangmanGame}
   */
  #game;

  /**
   * @type {boolean}
   */
  #done = true;

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
  }

  print() {
    const [cols] = process.stdout.getWindowSize();
    let line = "";
    for (let i = 0; i < cols; i++) {
      line += "▓";
    }
    console.log(white(line));
    const title = bold(rainbow("\t ~ A D I V I N A   L A   P A L A B R A ~ "));
    console.log();
    console.log(title);
    console.log()
  }

  /**
   * Actualiza el estado del componente
   * @param {import("../").KeypressEvent} key Tecla presionada
   */
  update(key) {}

  /**
   * @returns {boolean}
   */
  get isDone() {
    return this.#done;
  }
}

module.exports = { TitleTuiComponent };
