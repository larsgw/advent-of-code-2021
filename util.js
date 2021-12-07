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
  return module.exports.readNumberArray(lines)
}

module.exports.readNumberArray = function (array) {
  return array.map(number => parseInt(number))
}
