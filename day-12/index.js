const { readLines } = require('../util.js')

const test = readInput(`start-A
start-b
A-c
A-b
b-d
A-end
b-end`)
const input = readInput()

const CAN_VISIT_ONE_SMALL_CAVE_TWICE = 1

function readInput (input) {
    const map = new Map()
    for (const [a, b] of readLines(input).map(line => line.split('-'))) {
        if (!map.has(a)) { map.set(a, new Set()) }
        if (!map.has(b)) { map.set(b, new Set()) }
        map.get(a).add(b)
        map.get(b).add(a)
    }
    return map
}

function visit (position, visited, flag) {
    if (position === 'start' && visited.has(position)) {
        return null
    } else if (position === position.toLowerCase() && visited.has(position)) {
        if ((flag & CAN_VISIT_ONE_SMALL_CAVE_TWICE) && !visited.has('small')) {
            return new Set([...visited, 'small'])
        } else {
            return null
        }
    }

    return new Set([...visited, position])
}

function findPaths (position, map, flag, visited = new Set()) {
    if (position === 'end') {
        return [visited]
    }

    const paths = []
    for (const option of map.get(position)) {
        const newVisited = visit(position, visited, flag)
        if (newVisited) {
            paths.push(...findPaths(option, map, flag, newVisited))
        }
    }

    return paths
}

console.log('12-1-test:', findPaths('start', test).length)
console.log('12-1:', findPaths('start', input).length)

console.log('12-2-test:', findPaths('start', test, CAN_VISIT_ONE_SMALL_CAVE_TWICE).length)
console.log('12-2:', findPaths('start', input, CAN_VISIT_ONE_SMALL_CAVE_TWICE).length)
