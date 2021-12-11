const { readLines } = require('../util.js')

const test = readInput(`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`)
const input = readInput()

function readInput (input) {
    const lines = readLines(input)
    return lines.map(line => line.split('').map(char => parseInt(char)))
}

function incrementNeighbours (x, y, jellyfish) {
    const neighbours = []
    for (let dy = -1; dy <= 1; dy++) {
        if (jellyfish[y + dy] == null) continue
        for (let dx = -1; dx <= 1; dx++) {
            if (jellyfish[y + dy][x + dx] == null) continue
            jellyfish[y + dy][x + dx]++
            neighbours.push([x + dx, y + dy])
        }
    }
    return neighbours
}

function step (jellyfish) {
    const toTrigger = []

    for (let y = 0; y < jellyfish.length; y++) {
        for (let x = 0; x < jellyfish[y].length; x++) {
            jellyfish[y][x]++
            if (jellyfish[y][x] > 9) {
                toTrigger.push([x, y])
            }
        }
    }

    const flashes = []
    while (toTrigger.length) {
        const [x, y] = toTrigger.shift()
        flashes.push([x, y])
        for (const neighbour of incrementNeighbours(x, y, jellyfish)) {
            const charge = jellyfish[neighbour[1]][neighbour[0]]
            if (charge == 10) {
                toTrigger.push([neighbour[0], neighbour[1]])
            }
        }
    }

    for (const [x, y] of flashes) {
        jellyfish[y][x] = 0
    }

    return flashes.length
}

function simulate (jellyfish, steps) {
    jellyfish = jellyfish.map(line => line.slice())

    let flashes = 0
    while (steps--) {
        flashes += step(jellyfish)
    }
    return flashes
}

function findSynchronisation (jellyfish) {
    jellyfish = jellyfish.map(line => line.slice())
    let steps = 0

    while (true) {
        steps++
        const flashes = step(jellyfish)
        if (flashes === 100) return steps
    }
}

console.log('11-1-test:', simulate(test, 100))
console.log('11-1:', simulate(input, 100))

console.log('11-2-test:', findSynchronisation(test))
console.log('11-2:', findSynchronisation(input))
