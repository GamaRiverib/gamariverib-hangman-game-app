/// @ts-check

const { red, yellow, underline, green, bold, cyan, bgGreen, bgRed } = require("colors");
const { HangmanGame, GameStatus, Difficulty, Letters, HelperTypeEnum, GameRoundStatus, stringToLetter } = require("@gamariverib/hangman-game-lib");
const { KeywordsTuiComponent } = require("./keyword");
const { GameStatisticsTuiComponent } = require("./statistics");

const difficulties = ["Fácil", "Normal", "Díficil"];

class GameTuiComponent {
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
   * @type {string[]}
   */
  #messages = [];

  /**
   * @type {boolean}
   */
  #showStatistics = false;

  /**
   * @type {GameStatisticsTuiComponent}
   */
  #statisticComponent;

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

    this.#statisticComponent = new GameStatisticsTuiComponent(game);
  }

  #getStatisticsLine() {
    const statistics = this.#game.statistics;
    if (!statistics) {
      return " ";
    }
    let line = yellow("Ronda: ");
    line += bold(green(`${statistics.rounds + 1}`));
    line += yellow("\t\tNivel: ");
    line += bold(green(`${difficulties[this.#game.difficulty || Difficulty.Easy]}`));
    if (this.#game.statistics) {
      line += yellow("\t\tRacha: ");
      line += bold(green(`${this.#game.statistics.consecutiveWins}`));
    }
    return line;
  }

  /**
   * Línea de oportunidades
   * @returns {string}
   */
  #getOportunitiesLine() {
    const total = this.#game.state?.config.oportunities || 0;
    const remaining = this.#game.state?.round.remainingOportunities || 0;
    let line = yellow("Oportunidades: \t");
    for (let i = 0; i < total - remaining; i++) {
      line += ` ${red("\u2588\u2588\u2588")} `;
    }
    for (let i = 0; i < remaining; i++) {
      line += " \u2588\u2588\u2588 ";
    }
    return line;
  }

  /**
   * Línea de la palabra
   * @returns {string}
   */
  #getWordLine() {
    const word = this.#game.state?.round.word;
    if (!word) {
      return "";
    }
    let line = yellow("Palabra: \t");
    word.forEach((letter) => {
      line +=
        letter === " " ? " ___ " : green(` _${bold(underline(letter.toLocaleUpperCase()))}_ `);
    });
    return line;
  }

  /**
   * Lista de pistas
   * @returns {string[]}
   */
  #getHints() {
    const category = this.#game.state?.round.category;
    const definition = this.#game.state?.round.definition;
    const hints = this.#game.state?.round.hints;
    const list = [];
    if (category) {
      list.push(category);
    }
    if (definition) {
      list.push(definition);
    }
    if (hints && hints.length) {
      list.push(...hints);
    }
    return list;
  }

  /**
   * Línea de las pistas
   * @returns {string}
   */
  #getHintsLine() {
    const hints = this.#getHints();
    if (!hints.length) {
      return " ";
    }
    let line = yellow("Pistas: \t ");
    line += hints[0];
    return line;
  }

  /**
   * Líneas de las letras
   * @returns {string[]}
   */
  #getLettersLines() {
    const [cols] = process.stdout.getWindowSize();
    const lineLength = Math.floor((cols - 10) / 5);
    const rows = Math.round(Letters.length / lineLength) + 1;
    const lines = [];
    let i = 0;
    const remaining = this.#game.state?.round.remainingLetters || [];
    const word = this.#game.state?.round.word;
    lines.push(yellow("Letras: \r\n"));
    for (let j = 0; j < rows; j++) {
      let line = "\t";
      for (; i < lineLength * (j + 1); i++) {
        if (i < Letters.length) {
          const l = Letters[i];
          if (remaining.includes(l)) {
            line += bold(`  ${l.toLocaleUpperCase()}  `);
          } else {
            if (word?.includes(l)) {
              line += bold(`  ${green(l.toLocaleUpperCase())}  `);
            } else {
              line += bold(`  ${red(l.toLocaleUpperCase())}  `);
            }
          }
        }
      }
      lines.push(line);
    }
    return lines;
  }

  /**
   * Línea de ayudas disponibles
   * @returns {string};
   */
  #getHelpersLine() {
    const helpers = this.#game.state?.config.helpers;
    if (!helpers || !helpers.length) {
      return " ";
    }
    let line = yellow("Ayudas: \t\r\n\t");
    const round = this.#game.state?.round;
    if (!round) {
      return " ";
    }
    helpers.forEach((helper) => {
      switch (helper.type) {
        case HelperTypeEnum.DiscardRandomLetter:
          if (round.getRemainingHelpers(helper.type)) {
            line += ` Descartar (Key 1) \t `;
          }
          break;
        case HelperTypeEnum.DiscoverRandomLetter:
          if (round.getRemainingHelpers(helper.type)) {
            line += ` Descubrir (Key 2) \t `;
          }
          break;
        case HelperTypeEnum.DiscoverHint:
          const hints = this.#getHints();
          if (round.getRemainingHelpers(helper.type) && hints.length > 1) {
            line += ` Otra pista (Key 3) \t `;
          }
          break;
      }
    });
    return line;
  }

  #printMenu() {
    const status = this.#game.state?.status;
    const round = this.#game.state?.round.status;
    this.#keys.clear();
    if (!status && !round) {
      return " ";
    }
    this.#keys.addOption("CTRL+E", " Salir ");
    if (this.#game.statistics) {
      this.#keys.addOption("CTRL+S", " Estadísticas ");
    }
    if (status === GameStatus.Playing) {
      this.#keys.addOption("CTRL+P", " Pausar ");
    } else if (status === GameStatus.Paused) {
      this.#keys.addOption("CTRL+R", " Reanudar ");
    }
    if (round === GameRoundStatus.Finished) {
      this.#keys.addOption("ENTER", " Siguiente ");
    }
    this.#keys.print();
  }

  #getMessagesLines() {
    let lines = [];
    const status = this.#game.state?.round.status;
    const completed = this.#game.state?.round.completed;
    if (status && status === GameRoundStatus.Finished) {
      lines = [];
      if (completed) {
        lines.push(`${yellow("Mensajes:")} \t ${bgGreen(" ¡ G A N A S T E ! \u263A ")}`);
      } else {
        lines.push(`${yellow("Mensajes:")} \t ${bgRed(" P E R D I S T E \u2639 ")}`);
      }
      return lines;
    }
    if (this.#messages.length) {
      lines.push(yellow("Mensajes: \r\n"));
      this.#messages.forEach((message) => {
        lines.push(`\t \u270E  ${message}`);
      });
      this.#messages = [];
    }
    return lines;
  }

  print() {
    if (this.#showStatistics && this.#game.statistics) {
      this.#statisticComponent.print();
    } else {
      console.log(this.#getStatisticsLine());
      console.log();
      console.log(this.#getOportunitiesLine());
      console.log();
      console.log(this.#getWordLine());
      console.log();
      console.log(this.#getHintsLine());
      console.log();
      this.#getLettersLines().forEach((line) => {
        console.log(line);
        console.log();
      });
      console.log(this.#getHelpersLine());
      console.log();
      console.log();
      this.#getMessagesLines().forEach((line) => {
        console.log(line);
      });
      console.log();
      this.#printMenu();
    }
  }

  /**
   * Actualiza el estado del componente
   * @param {import("..").KeypressEvent} key Tecla presionada
   */
  update(key) {
    if (key.ctrl) {
      switch (key.name) {
        case "e":
          this.#game.finish();
          break;
        case "s":
          this.#showStatistics = true;
          break;
        case "p":
          this.#game.pause();
          break;
        case "r":
          this.#game.resume();
          break;
        case "n":
          this.#messages = [];
          this.#game.next();
          break;
        case "b":
          this.#showStatistics = false;
          break;
        default:
          this.#messages.push(yellow(`Combinación CTRL+${key.name} no soportada`));
      }
      return;
    }

    if (this.#showStatistics && (key.name === "b" || key.name === "backspace")) {
      this.#showStatistics = false;
      return;
    }

    if (key.name === "return") {
      const status = this.#game.state?.round.status;
      if (status && status === GameRoundStatus.Finished) {
        this.#game.next();
      }
      this.#messages = [];
      return;
    }

    if (key.name === "backspace") {
      this.#game.finish();
      return;
    }

    if (key.name === "1") {
      try {
        this.#game.useHelper(HelperTypeEnum.DiscardRandomLetter);
        this.#messages.push(`Uso la ayuda: ${cyan("Descartar letra aleatoriamente")}`);
      } catch (reason) {
        this.#messages.push(`Error con ayuda ${yellow("Descartar pista")}: ${red(reason.message || reason)}`);
      }
      return;
    }

    if (key.name === "2") {
      try {
        this.#game.useHelper(HelperTypeEnum.DiscoverRandomLetter);
        this.#messages.push(`Uso la ayuda: ${cyan("Descurbir letra aleatoriamente")}`);
      } catch (reason) {
        this.#messages.push(`Error con ayuda ${yellow("Descurbir letra")}: ${red(reason.message || reason)}`);
      }
      return;
    }

    if (key.name === "3") {
      try {
        this.#game.useHelper(HelperTypeEnum.DiscoverHint);
        this.#messages.push(`Uso la ayuda: ${cyan("Descurbir otra pista")}`);
      } catch (reason) {
        this.#messages.push(`Error con ayuda ${yellow("Descurbir pista")}: ${red(reason.message || reason)}`);
      }
      return;
    }

    const status = this.#game.state?.status;

    if (status === GameStatus.Playing) {
      const letter = stringToLetter(key.name);
      if (letter) {
        const remaining = this.#game.state?.round.remainingLetters || [];
        if (!remaining.includes(letter)) {
          this.#messages.push(yellow(`Letra ${cyan(letter.toLocaleUpperCase())} ya utilizada ${cyan("\u2757")}`));
          return;
        }
        try {
          const l = stringToLetter(letter);
          if (this.#game.proveLetter(l || letter)) {
            this.#messages.push(`Letra ${cyan(letter.toLocaleUpperCase())} encontrada ${green("\u2714")}`);
          } else {
            this.#messages.push(`Letra ${cyan(letter.toLocaleUpperCase())} no encontrada ${red("\u2718")}`);
          }
        } catch (reason) {
          this.#messages.push(red(reason.message || reason));
        }
      } else {
        this.#messages.push(red("Seleccione una de las letras de la lista"));
      }
    }
  }

  /**
   * @returns {boolean}
   */
  get isDone() {
    return this.#done;
  }
}

module.exports = { GameTuiComponent };
