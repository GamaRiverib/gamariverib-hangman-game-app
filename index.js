#!/usr/bin/env node
// @ts-check

const readline = require("readline");

const { rainbow, bold } = require("colors");

const { HangmanGame, GameStatus } = require("@gamariverib/hangman-game-lib");

const { getHangmanGameInstance, saveGameConfig, saveGameStatistics } = require("./game");

const { SetupTuiComponent } = require("./tui/setup/setup");
const { TitleTuiComponent } = require("./tui/title");
const { GameTuiComponent } = require("./tui/game");

/**
 * @typedef {Object} KeypressEvent
 * @property {string} sequence
 * @property {string} name
 * @property {boolean} ctrl
 * @property {boolean} meta
 * @property {boolean} shift
 * @property {string} code
 */

/**
 * @typedef {{print: () => void, update: (key: KeypressEvent) => void, isDone: boolean }} TuiComponent
 */

/**
 * @type {HangmanGame}
 */
const game = getHangmanGameInstance();

const titleComponent = new TitleTuiComponent(game);
const setupComponent = new SetupTuiComponent(game);
const gameComponent = new GameTuiComponent(game);

/**
 * @type {TuiComponent[]}
 */
const setupView = [titleComponent, setupComponent];

/**
 * @type {TuiComponent[]}
 */
const gameView = [titleComponent, gameComponent];

/**
 * @type {TuiComponent[]}
 */
let activeView = setupView;

/**
 * Ejecuta la función print de los componentes de la vista
 * @param {TuiComponent[]} views
 */
function printViewComponents(views) {
  if (Array.isArray(views)) {
    views.forEach((view) => view.print());
  }
  process.stdout.cursorTo(0, 0);
}

/**
 * Actualiza los componentes de la vista
 * @param {TuiComponent[]} views
 * @param {KeypressEvent} key
 */
function updateViewComponents(views, key) {
  if (Array.isArray(views)) {
    views.forEach((view) => view.update(key));
  }
}

readline.emitKeypressEvents(process.stdin);

process.stdin.setRawMode(true);

process.stdin.resume();

process.stdin.setEncoding("utf-8");

function clearScreen() {
  const [, rows] = process.stdout.getWindowSize();
  for (let i = 0; i < rows; i++) {
    console.log("\r\n");
  }
  process.stdout.cursorTo(0, 0);
}

clearScreen();

printViewComponents(activeView);

process.stdin.on("keypress", (/** @type {string} */ str, /** @type {KeypressEvent} */ key) => {
  if ((key.ctrl && key.name === "c") || key.name === "escape") {
    if (game.state) {
      saveGameConfig(game.state.config);
    }
    if (game.statistics) {
      saveGameStatistics(game.statistics);
    }
    clearScreen();
    console.log(bold(rainbow(" Saliendo...")));
    process.stdout.cursorTo(0, 0);
    setTimeout(() => {
      clearScreen();
      process.exit(0);
    }, 1000);
    return;
  }
  updateViewComponents(activeView, key);
  clearScreen();
  if (game.state) {
    const status = game.state?.status;
    switch (status) {
      case GameStatus.Setup:
        activeView = setupView;
        break;
      case GameStatus.Finished:
        if (game.statistics) {
          saveGameStatistics(game.statistics);
        }
        activeView = setupView;
        break;
      case GameStatus.Playing:
        saveGameConfig(game.state.config);
        activeView = gameView;
        break;
      case GameStatus.Paused:
        activeView = gameView;
        break;
      default:
        activeView = setupView;
    }
  }
  printViewComponents(activeView);
});
