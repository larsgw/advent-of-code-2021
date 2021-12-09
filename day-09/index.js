const { readLines } = require('../util.js')

const test = readInput(`2199943210
3987894921
9856789892
8767896789
9899965678`)
const input = readInput()

function readInput (input) {
    return readLines(input)
        .map(line => line.split('').map(point => parseInt(point)))
}

function getNeighbours(x, y, heatmap) {
    x = parseInt(x)
    y = parseInt(y)

    const h = heatmap.length - 1
    const w = heatmap[y].length -1
    const neighbours = []

    if (y > 0) { neighbours.push([x, y - 1]) }
    if (x < w) { neighbours.push([x + 1, y]) }
    if (y < h) { neighbours.push([x, y + 1]) }
    if (x > 0) { neighbours.push([x - 1, y]) }

    return neighbours
}

function getLowPoints (heatmap) {
    const lowPoints = []
    for (let y = 0; y < heatmap.length; y++) {
        for (let x = 0; x < heatmap[y].length; x++) {
            const point = heatmap[y][x]
            const neighbours = getNeighbours(x, y, heatmap)
            if (neighbours.every(([x, y]) => heatmap[y][x] > point)) {
                lowPoints.push([x, y])
            }
        }
    }
    return lowPoints
}

function getRiskScore (heatmap) {
    return getLowPoints(heatmap).reduce((sum, [x, y]) => sum + heatmap[y][x] + 1, 0)
}

function getBasins (heatmap) {
    const lowPoints = getLowPoints(heatmap)
    const basins = lowPoints.map(lowPoint => {
        const points = new Set()
        const unchecked = [lowPoint]

        while (unchecked.length) {
            const point = unchecked.shift()
            if (points.has(point.join())) continue

            for (const [x, y] of getNeighbours(point[0], point[1], heatmap)) {
                if (heatmap[y][x] !== 9) {
                    unchecked.push([x, y])
                }
            }

            points.add(point.join())
        }

        return points
    })

    return basins
        .map(basin => basin.size)
        .sort((a, b) => a - b)
        .slice(-3)
        .reduce((a, b) => a * b)
}

console.log('9-1-test:', getRiskScore(test))
console.log('9-1:', getRiskScore(input))

console.log('9-2-test:', getBasins(test))
console.log('9-2:', getBasins(input))
