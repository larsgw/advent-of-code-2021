const { readLines, readNumberArray } = require('../util.js')

function drawPoint (coord, map) {
    map[coord] = (map[coord] || 0) + 1
}

function drawLine (line, map, diagonal) {
    const [start, end] = line.split(' -> ')
    const [x1, y1] = readNumberArray(start.split(','))
    const [x2, y2] = readNumberArray(end.split(','))

    if (x1 === x2) {
        const [yMin, yMax] = y1 > y2 ? [y2, y1] : [y1, y2]
        for (let y = yMin; y <= yMax; y++) {
            drawPoint([x1, y], map)
        }
    } else if (y1 === y2) {
        const [xMin, xMax] = x1 > x2 ? [x2, x1] : [x1, x2]
        for (let x = xMin; x <= xMax; x++) {
            drawPoint([x, y1], map)
        }
    } else if (diagonal) {
        const [xMin, xMax] = x1 > x2 ? [x2, x1] : [x1, x2]
        const [yStart, yEnd] = x1 > x2 ? [y2, y1] : [y1, y2]
        for (let x = xMin; x <= xMax; x++) {
            const direction = yStart > yEnd ? -1 : 1
            drawPoint([x, yStart + direction * (x - xMin)], map)
        }
    }
}

function generateMap (lines, diagonal) {
    const map = {}
    lines.forEach(line => drawLine(line, map, diagonal))
    return map
}

function countDangerZones (lines, diagonal) {
    const map = generateMap(lines, diagonal)
    let count = 0
    for (const coord in map) {
        if (map[coord] > 1) {
            count++
        }
    }
    return count
}

const test = readLines(`0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`)
const input = readLines()

console.log('5-1-test:', countDangerZones(test))
console.log('5-1:', countDangerZones(input))

console.log('5-2-test:', countDangerZones(test, true))
console.log('5-2:', countDangerZones(input, true))
