const fs = require('fs')

module.exports.readInput = function () {
  return fs.readFileSync('input.txt', 'utf8')
}

module.exports.readLines = function (file) {
  if (!file) {
    file = module.exports.readInput()
  }
  return file.trim().split('\n')
}

module.exports.readNumbers = function (lines) {
  if (!Array.isArray(lines)) {
    lines = module.exports.readLines(lines)
  }
  return lines.map(number => parseInt(number))
}
