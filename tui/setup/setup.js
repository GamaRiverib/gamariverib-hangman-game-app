/// @ts-check

const { HangmanGame } = require("@gamariverib/hangman-game-lib");
const { KeywordsTuiComponent } = require("../keyword");
const { SetupLanguageTuiComponent } = require("./setup_language");
const { SetupCategoriesTuiComponent } = require("./setup_categories");
const { SetupDifficultyTuiComponent } = require("./setup_difficulty");
const { bgGreen } = require("colors");
const { GameStatisticsTuiComponent } = require("../statistics/statistics");

class SetupTuiComponent {
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
   * @type {SetupLanguageTuiComponent}
   */
  #setupLanguage;

  /**
   * @type {SetupCategoriesTuiComponent}
   */
  #setupCategories;

  /**
   * @type {SetupDifficultyTuiComponent}
   */
  #setupDifficulty;

  /**
   * @type {GameStatisticsTuiComponent}
   */
  #statisticComponent;

  /**
   * @type {boolean}
   */
  #showStatistics = false;

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

    this.#setupLanguage = new SetupLanguageTuiComponent(game);
    this.#setupCategories = new SetupCategoriesTuiComponent(game);
    this.#setupDifficulty = new SetupDifficultyTuiComponent(game);
    this.#statisticComponent = new GameStatisticsTuiComponent(game);
  }

  print() {
    if (this.#showStatistics) {
      this.#statisticComponent.print();
    } else {
      console.log(bgGreen("\r\n C O N F I G U R A C I Ó N \r\n"));
      if (!this.#game.language) {
        this.#setupLanguage.print();
      } else if (!this.#setupCategories.isDone) {
        this.#setupLanguage.print();
        this.#setupCategories.print();
      } else if (!this.#setupDifficulty.isDone) {
        this.#setupLanguage.print();
        this.#setupCategories.print();
        this.#setupDifficulty.print();
      } else {
        this.#setupLanguage.print();
        this.#setupCategories.print();
        this.#setupDifficulty.print();
        console.log();
        this.#keys.clear();
        this.#keys.addOption("Left", " Cambiar ");
        this.#keys.addOption("S", " Estadísticas ");
        this.#keys.addOption("Enter", " Jugar ");
        this.#keys.print();
      }
    }
  }

  /**
   * Actualiza el estado del componente
   * @param {import("../..").KeypressEvent} key Tecla presionada
   */
  update(key) {
    if (key.name === "s") {
      this.#showStatistics = true;
      return;
    }

    if (key.ctrl) {
      switch (key.name) {
        case "b":
          this.#showStatistics = false;
          break;
      }
      return;
    }

    if (this.#showStatistics && (key.name === "b" || key.name === "backspace")) {
      this.#showStatistics = false;
      return;
    }

    if (!this.#game.language) {
      this.#setupLanguage.update(key);
    } else if (!this.#setupCategories.isDone) {
      this.#setupCategories.update(key);
    } else if (!this.#setupDifficulty.isDone) {
      this.#setupDifficulty.update(key);
    } else {
      switch (key.name) {
        case "return":
        case "right":
          this.#game.play();
          this.#done = true;
          break;
      }
    }
    if (key.name === "left") {
      if (this.#setupDifficulty.isDone) {
        this.#setupDifficulty.change();
      } else if (this.#setupCategories.isDone) {
        this.#setupCategories.change();
      } else if (this.#setupLanguage.isDone) {
        this.#setupLanguage.change();
      }
    }
  }

  /**
   * @returns {boolean}
   */
  get isDone() {
    return (
      this.#done &&
      this.#setupLanguage.isDone &&
      this.#setupCategories.isDone &&
      this.#setupDifficulty.isDone
    );
  }
}

module.exports = { SetupTuiComponent };
