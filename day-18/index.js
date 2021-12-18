const { readLines } = require('../util.js')

const test = readInput(`[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`)
const input = readInput()

function readInput (input) {
    return readLines(input).map(line => JSON.parse(line))
}

function flattenNumbers (number) {
    return number.flatMap((v, i, a) => {
        if (Array.isArray(v)) {
            return flattenNumbers(v)
        } else {
            return [[v, i, a]]
        }
    })
}

function addToNumber (pair, direction, flatNumbers) {
    const add = pair[direction]
    const i = flatNumbers.findIndex((flatNumber) =>
        flatNumber[2] === pair && flatNumber[1] === direction
    )

    if (direction === 0 && i > 0) {
        const [_, fnDirection, fnPair] = flatNumbers[i - 1]
        fnPair[fnDirection] += add
    } else if (direction === 1 && i < flatNumbers.length - 1) {
        const [_, fnDirection, fnPair] = flatNumbers[i + 1]
        fnPair[fnDirection] += add
    }
}

function explode (number, flatNumbers, depth = 1) {
    if (!Array.isArray(number)) {
        return undefined
    } else if (depth <= 4 || number.some(Array.isArray)) {
        const left = explode(number[0], flatNumbers, depth + 1)

        if (left !== undefined) {
            return [left, number[1]]
        }

        const right = explode(number[1], flatNumbers, depth + 1)
        if (right !== undefined) {
            return [number[0], right]
        } else {
            return undefined
        }
    } else {
        addToNumber(number, 0, flatNumbers)
        addToNumber(number, 1, flatNumbers)
        return 0
    }
}

function split (number) {
    if (Array.isArray(number)) {
        const left = split(number[0])
        const right = split(number[1])

        if (left !== undefined) {
            return [left, number[1]]
        } else if (right !== undefined) {
            return [number[0], right]
        } else {
            return undefined
        }
    } else if (number >= 10) {
        return [
            Math.floor(number / 2),
            Math.ceil(number / 2)
        ]
    } else {
        return undefined
    }
}

function reduce (number) {
    let old = undefined

    while (JSON.stringify(number) !== old) {
        old = JSON.stringify(number)

        const flatNumbers = flattenNumbers(number)
        const exploded = explode(number, flatNumbers)
        if (exploded) {
            number = exploded
            continue
        }
        const splitted = split(number)
        if (splitted) {
            number = splitted
            continue
        }
    }

    return number
}

function getMagnitude (number) {
    if (Array.isArray(number)) {
        return 3 * getMagnitude(number[0]) + 2 * getMagnitude(number[1])
    } else {
        return number
    }
}

function clone (number) {
    return JSON.parse(JSON.stringify(number))
}

function add (a, b) {
    return reduce([clone(a), clone(b)])
}

function findHomeworkAnswer (numbers) {
    return getMagnitude(numbers.reduce(add))
}

function findLargestMagnitude (numbers) {
    const magnitudes = numbers.flatMap(a => {
        return numbers.flatMap(b => {
            if (a !== b) {
                return getMagnitude(add(a, b))
            } else {
                return []
            }
        })
    })

    return Math.max(...magnitudes)
}

console.log('18-1-test:', findHomeworkAnswer(test))
console.log('18-1:', findHomeworkAnswer(input))

console.log('18-2-test:', findLargestMagnitude(test))
console.log('18-2:', findLargestMagnitude(input))
