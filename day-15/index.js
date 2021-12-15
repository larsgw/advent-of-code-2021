const { readLines } = require('../util.js')

const test = readInput(`1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`)
const input = readInput()
const extendedTest = readInput(extendInput(`1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`))
const extendedInput = readInput(extendInput())

function addVertex (graph, from, weight, to) {
    if (!graph[from]) {
        graph[from] = []
    }

    graph[from].push([to, weight])
}

function readInput (input) {
    const graph = {}
    const lines = readLines(input)

    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const weight = parseInt(lines[y][x])
            const to = [x, y].join()
            if (x > 0) addVertex(graph, [x - 1, y], weight, to)
            if (y > 0) addVertex(graph, [x, y - 1], weight, to)
            if (x < lines[y].length - 1) addVertex(graph, [x + 1, y], weight, to)
            if (y < lines.length - 1) addVertex(graph, [x, y + 1], weight, to)
        }
    }

    const end = [lines[lines.length - 1].length - 1, lines.length - 1].join()
    return { graph, end }
}

function extendInput (input) {
    const lines = readLines(input)
    let extendedInput = ''

    for (let yi = 0; yi < 5; yi++) {
        for (let y = 0; y < lines.length; y++) {
            for (let xi = 0; xi < 5; xi++) {
                const increase = xi + yi
                for (let x = 0; x < lines[y].length; x++) {
                    const risk = parseInt(lines[y][x]) + increase
                    // Wrap 9 to 1
                    extendedInput += 1 + ((risk - 1) % 9)
                }
            }
            extendedInput += '\n'
        }
    }

    return extendedInput
}

function getLowestTotalRiskScore ({ graph, end }) {
    const G = Object.keys(graph)
    const g_b = '0,0'
    let A = new Set(g_b)
    let X = new Set(graph[g_b].map(([node]) => node))
    const d = Object.fromEntries(graph[g_b])

    while (X.size) {
        const [d_x, x] = [...X].reduce(([min, minNode], node) => {
            return d[node] < min ? [d[node], node] : [min, minNode]
        }, [Infinity, undefined])

        X.delete(x)
        A.add(x)

        for (const [z, gew_x_z] of graph[x]) {
            if (A.has(z)) {
                continue
            } else if (!X.has(z)) {
                X.add(z)
                d[z] = d_x + gew_x_z
            } else {
                d[z] = Math.min(d[z], d_x + gew_x_z)
            }
        }
    }

    return d[end]
}

console.log('15-1-test:', getLowestTotalRiskScore(test))
console.log('15-1:', getLowestTotalRiskScore(input))

console.log('15-2-test:', getLowestTotalRiskScore(extendedTest))
console.log('15-2:', getLowestTotalRiskScore(extendedInput))
