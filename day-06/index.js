const { readInput: readFile, readNumberArray } = require('../util.js')

function readInput (input) {
    if (!input) {
        input = readFile(input)
    }

    return readNumberArray(input.trim().split(','))
}

// function simulateFish (fish, days) {
//     fish = fish.slice()
//     let numberOfFish
//
//     while (days-- >= 0) {
//         numberOfFish = fish.length
//         for (let i = 0; i < numberOfFish; i++) {
//             if (fish[i]) {
//                 fish[i]--
//             } else {
//                 fish.push(8)
//                 fish[i] = 6
//             }
//         }
//     }
//
//     return numberOfFish
// }

function simulateFish (fishes, days) {
    let counts = Array(9).fill(0)

    for (const fish of fishes) {
        counts[fish]++
    }

    while (days--) {
        const newCounts = Array(9).fill(0)
        newCounts[6] = counts[0]
        newCounts[8] = counts[0]
        for (let age = 1; age < counts.length; age++) {
            newCounts[age - 1] += counts[age]
        }
        counts = newCounts
    }

    return counts.reduce((a, b) => a + b)
}

const test = readInput('3,4,3,1,2')
const input = readInput()

console.log('6-1-test:', simulateFish(test, 80))
console.log('6-1:', simulateFish(input, 80))

console.log('6-2:', simulateFish(input, 256))
