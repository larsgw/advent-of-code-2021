const { readNumberLine } = require('../util.js')

const test = readNumberLine(`16,1,2,0,4,2,7,1,2,14`)
const input = readNumberLine()

function constantDistance (a, b) {
    return Math.abs(a - b)
}

function incrementalDistance (a, b) {
    const n = constantDistance(a, b)
    return n * (n + 1) / 2
}

function alignCrabs (crabs, distance) {
    const min = Math.min(...crabs)
    const max = Math.max(...crabs)

    let score = Infinity

    for (let i = min; i <= max; i++) {
        score = Math.min(score, crabs.reduce((a, b) => a + distance(i, b), 0))
    }

    return score
}

console.log('7-1-test:', alignCrabs(test, constantDistance))
console.log('7-1:', alignCrabs(input, constantDistance))

console.log('7-2-test:', alignCrabs(test, incrementalDistance))
console.log('7-2:', alignCrabs(input, incrementalDistance))
