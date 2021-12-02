const { readLines } = require('../util.js')

const test = readLines(`forward 5
down 5
forward 8
up 3
down 8
forward 2`)
const input = readLines()

function updatePosition ([horizontal, depth], instruction) {
  const [direction, units] = instruction.split(' ')
  const x = parseInt(units)
  switch (direction) {
    case 'forward': return [horizontal + x, depth]
    case 'down': return [horizontal, depth + x]
    case 'up': return [horizontal, depth - x]
    default: throw new Error(`Unknown direction "${direction}"`)
  }
}

function calculatePosition (instructions) {
  const [horizontal, depth] = instructions.reduce(updatePosition, [0, 0])
  return horizontal * depth
}

console.log('1-1-test:', calculatePosition(test))
console.log('1-1:', calculatePosition(input))

function updatePosition2 ([horizontal, depth, aim], instruction) {
  const [direction, units] = instruction.split(' ')
  const x = parseInt(units)
  switch (direction) {
    case 'forward': return [horizontal + x, depth + aim * x, aim]
    case 'down': return [horizontal, depth, aim + x]
    case 'up': return [horizontal, depth, aim - x]
    default: throw new Error(`Unknown direction "${direction}"`)
  }
}

function calculatePosition2 (instructions) {
  const [horizontal, depth] = instructions.reduce(updatePosition2, [0, 0, 0])
  return horizontal * depth
}

console.log('1-2-test:', calculatePosition2(test))
console.log('1-2:', calculatePosition2(input))
