const { readNumbers } = require('../util.js')

function countIncreases (numbers, window = 1) {
  const [increases] = numbers.reduce(([increases, prev], number) => {
    prev.push(number)
    if (prev.length <= window) {
      return [increases, prev]
    } else if (number > prev.shift()) {
      return [increases + 1, prev]
    } else {
      return [increases, prev]
    }
  }, [0, []])
  return increases
}

const test = readNumbers(`199
200
208
210
200
207
240
269
260
263`)
const numbers = readNumbers()

console.log('1-1-test:', countIncreases(test))
console.log('1-1:', countIncreases(numbers))

console.log('1-2-test:', countIncreases(test, 3))
console.log('1-2:', countIncreases(numbers, 3))
