/// @ts-check

const fs = require("fs");
const path = require("path");

const {
  GameStatistics,
  WordListManager,
  HangmanGame,
  GameConfig,
  WordList,
} = require("@gamariverib/hangman-game-lib");

const configFile = "config.json";
const statisticsFile = "statistics.txt";

/**
 * Obtiene la lista de palabras desde un archivo.
 * @param {string} fileName Nombre del archivo que contiene la lista de palabras
 * @param {*} language Idioma de la lista de palabras en el archivo
 * @returns {WordList}
 */
function getWordListFromCsvFileByLanguage(fileName, language) {
  const filePath = path.join(__dirname, "..", "words", language, fileName);
  const buffer = fs.readFileSync(filePath);
  const csvContent = buffer.toString();
  return WordList.fromCsv(language, csvContent);
}

/**
 * Obtiene la configuración del juego guardada previamente.
 * @param {HangmanGame} game Instancia del juego
 * @returns {void}
 */
function loadPreviousGameConfig(game) {
  try {
    if (!fs.existsSync(configFile)) {
      return;
    }
    const buffer = fs.readFileSync(configFile);
    const config = GameConfig.fromJson(JSON.parse(buffer.toString()));
    if (config) {
      game.setLanguage(config.language);
      if (config.categories) {
        config.categories.forEach((category) => {
          gameInstance?.addCategory(category);
        });
      }
      game.setDifficulty(config.difficulty);
    }
  } catch (reason) {
    console.log("Failed to load previous game settings");
  }
}

/**
 * Obtiene las estadísticas del juego guardada previamente.
 * @returns {GameStatistics|undefined}
 */
function getPreviousGameStatistics() {
  try {
    if (!fs.existsSync(statisticsFile)) {
      return;
    }
    const buffer = fs.readFileSync(statisticsFile);
    return GameStatistics.deserialize(buffer.toString());
  } catch (reason) {
    console.log("Failed to load previous game settings");
  }
}

/**
 * Guarda una configuración del juego.
 * @param {GameConfig} config
 * @returns {void}
 */
function saveGameConfig(config) {
  const json = JSON.stringify(config, null, 2);
  return fs.writeFileSync(configFile, json);
}

/**
 * Guarda las estadísticas del juego.
 * @param {GameStatistics} statistics
 */
function saveGameStatistics(statistics) {
  return fs.writeFileSync(statisticsFile, statistics.serialize());
}

/**
 * @type {HangmanGame|undefined}
 */
let gameInstance;

function getHangmanGameInstance() {
  if (gameInstance === undefined) {
    const fileName = "test.csv";
    const enWordList = getWordListFromCsvFileByLanguage(fileName, "en");
    const esWordList = getWordListFromCsvFileByLanguage(fileName, "es");
    const wordListManager = new WordListManager([esWordList, enWordList]);
    const previousStatistics = getPreviousGameStatistics();
    gameInstance = new HangmanGame(wordListManager, previousStatistics);
    loadPreviousGameConfig(gameInstance);
  }
  return gameInstance;
}

module.exports = {
  getHangmanGameInstance,
  saveGameConfig,
  saveGameStatistics,
};
