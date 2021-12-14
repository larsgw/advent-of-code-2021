const { readInput: readFile, readLines } = require('../util.js')

const test = readInput(`NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`)
const input = readInput()

function readInput (input) {
    const [template, rules] = (input || readFile()).split('\n\n')
    return {
        template,
        rules: readLines(rules).map(rule => {
            const [pair, insertion] = rule.split(' -> ')
            return [...pair, insertion]
        }).reduce((map, [a, b, c]) => {
            if (!map[a]) map[a] = {}
            map[a][b] = c
            return map
        }, {})
    }
}

function step (template, rules) {
    let polymer = ''

    for (let i = 1; i < template.length; i++) {
        const a = template[i - 1]
        const b = template[i]

        polymer += a
        if (rules[a] && rules[a][b]) {
            polymer += rules[a][b]
        }
    }

    polymer += template.slice(-1)

    polymer[0] // flatten cons string?

    return polymer
}

function getFirstSolution ({ template, rules }, steps) {
    while (steps--) {
        template = step(template, rules)
    }

    const quantities = Object.values(template
        .split('')
        .reduce((quantities, element) => increment(quantities, element), {})
    )

    return Math.max(...quantities) - Math.min(...quantities)
}

function increment (object, key, amount = 1) {
    if (key in object) {
        object[key] += amount
    } else {
        object[key] = amount
    }
    return object
}

function getSecondSolution ({ template, rules }, steps) {
    let quantities = {}

    for (let i = 1; i < template.length; i++) {
        increment(quantities, template[i - 1] + template[i])
    }

    while (steps--) {
        const newQuantities = {}

        for (const pair in quantities) {
            const [a, b] = pair.split('')
            const c = rules[a][b]
            increment(newQuantities, a + c, quantities[pair])
            increment(newQuantities, c + b, quantities[pair])
        }

        quantities = newQuantities
    }

    let elements = {}

    for (const pair in quantities) {
        const [a, b] = pair.split('')
        increment(elements, a, quantities[pair])
        increment(elements, b, quantities[pair])
    }

    elements = Object.values(elements)

    return Math.round((Math.max(...elements) - Math.min(...elements)) / 2)
}

console.log('14-1-test:', getFirstSolution(test, 10))
console.log('14-1:', getFirstSolution(input, 10))
console.log('14-2-test:', getSecondSolution(test, 40))
console.log('14-2:', getSecondSolution(input, 40))
