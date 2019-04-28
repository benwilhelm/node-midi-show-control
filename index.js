const msc = require("./lib/msc");

module.exports = {
  buildMessage: msc.buildMessage,
  parseMessage: msc.parseMessage,
  getAvailableCommands: msc.getAvailableCommands,
  getAvailableCommandFormats: msc.getAvailableCommandFormats
}
