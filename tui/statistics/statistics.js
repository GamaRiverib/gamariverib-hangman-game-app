/// @ts-check

const { yellow, red, bgGreen } = require("colors");
const { HangmanGame, GameStatistics } = require("@gamariverib/hangman-game-lib");
const { KeywordsTuiComponent } = require("../keyword");

const HelpersNames = ["Descubrir", "Descartar", "Pistas"];

class GameStatisticsTuiComponent {
  /**
   * @type {HangmanGame}
   */
  #game;

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
  }

  print() {
    /**
     * @type {GameStatistics|undefined}
     */
    const statistics = this.#game.statistics;
    console.log(bgGreen("\r\n   E S T A D Í S T I C A S   "));
    console.log();
    if (statistics) {
      console.log(` Rondas: \t\t ${yellow(statistics.rounds + "")}`);
      console.log(` Victorias: \t\t ${yellow(statistics.wins + "")}`);
      console.log(` Sin errores: \t\t ${yellow(statistics.noWrongLettersCount + "")}`);
      console.log(` Derrotas: \t\t ${yellow(statistics.lost + "")}`);
      console.log(` Racha: \t\t ${yellow(statistics.consecutiveWins + "")}`);
      console.log(` Mejor racha: \t\t ${yellow(statistics.highestConsecutiveWins + "")}`);
      console.log(` Aciertos: \t\t ${yellow(statistics.correctLeterCount + "")}`);
      console.log(` Errores: \t\t ${yellow(statistics.wrongLetterCount + "")}`);
      if (statistics.helpersCount) {
        for (const h of Object.keys(statistics.helpersCount)) {
          const helperName = HelpersNames[h];
          if (helperName) {
            const count = statistics.helpersCount[h];
            console.log(` Ayuda ${helperName}: \t ${yellow(count + "")}`);
          }
        }
      }
    } else {
      console.log(red("No hay estadísticas"));
    }
    console.log();
    this.#keys.clear();
    this.#keys.addOption("CTRL+B", " Regresar ");
    this.#keys.print();
  }

  /**
   * @param {import("../..").KeypressEvent} key
   */
  update(key) {
    switch (key.name) {
      case "b":
      case "back":
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

module.exports = { GameStatisticsTuiComponent };
