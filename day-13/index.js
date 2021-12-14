const { readInput: readFile, readLines, readNumberLine } = require('../util.js')

const test = readInput(`6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`)
const input = readInput()

const X = 'x'
const Y = 'y'

function readInput (input) {
    const [dots, instructions] = (input || readFile()).split('\n\n')
    return {
        dots: new Set(readLines(dots)),
        instructions: readLines(instructions).map(instruction => {
            const [, , axis] = instruction.split(' ')
            const [direction, offset] = axis.split('=')
            return [direction, parseInt(offset)]
        })
    }
}

function printPaper (dots) {
    let maxX = 0
    let maxY = 0

    for (const dot of dots) {
        const [x, y] = readNumberLine(dot)
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
    }

    return Array(maxY + 1)
        .fill(0)
        .map((line, y) => Array(maxX + 1)
            .fill(0)
            .map((_, x) => dots.has([x, y].join()) ? '#' : '.')
            .join('')
        )
        .join('\n')
}

function foldPaper (dots, [direction, offset]) {
    const foldedPaper = new Set()
    for (const dot of dots) {
        const [x, y] = readNumberLine(dot)
        if (direction === X && x > offset) {
            foldedPaper.add([2 * offset - x, y].join())
        } else if (direction === Y && y > offset) {
            foldedPaper.add([x, 2 * offset - y].join())
        } else {
            foldedPaper.add(dot)
        }
    }
    return foldedPaper
}

function countDotsFirstFold ({ dots, instructions }) {
    return foldPaper(dots, instructions[0]).size
}

function printFinalFold ({ dots, instructions }) {
    instructions = instructions.slice()

    while (instructions.length) {
        dots = foldPaper(dots, instructions.shift())
    }

    console.log(printPaper(dots))
}

console.log('13-1-test:', countDotsFirstFold(test))
console.log('13-1:', countDotsFirstFold(input))

console.log('13-2:', printFinalFold(input))
