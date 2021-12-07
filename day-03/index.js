const { readLines } = require('../util.js')

const test = readLines(`00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`)
const input = readLines()

function computeGammaEpsilonRates (report) {
    const zeros = Array(report[0].length).fill(0)
    const ones = zeros.slice()

    for (const line of report) {
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '0') {
                zeros[i]++
            } else if (line[i] === '1') {
                ones[i]++
            }
        }
    }

    let gamma = ''
    let epsilon = ''
    for (let i = 0; i < zeros.length; i++) {
        if (zeros[i] > ones[i]) {
            gamma += 0
            epsilon += 1
        } else {
            gamma += 1
            epsilon += 0
        }
    }

    return { gamma, epsilon }
}

function computePowerConsumption (report) {
    const { epsilon, gamma } = computeGammaEpsilonRates(report)
    return parseInt(gamma, 2) * parseInt(epsilon, 2)
}

console.log('3-1-test:', computePowerConsumption(test))
console.log('3-1:', computePowerConsumption(input))

function computeRating (report, bitCriterium) {
    let i = 0
    while (report.length > 1) {
        const bits = computeGammaEpsilonRates(report)[bitCriterium]
        report = report.filter(number => number[i] === bits[i])
        i++
    }
    return report[0]
}

function computeLifeSupportRating (report) {
    let oxygenGenerator = computeRating(report.slice(), 'gamma')
    let co2Scrubber = computeRating(report.slice(), 'epsilon')

    return parseInt(oxygenGenerator, 2) * parseInt(co2Scrubber, 2)
}

console.log('3-2-test:', computeLifeSupportRating(test))
console.log('3-2:', computeLifeSupportRating(input))
