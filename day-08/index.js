const { readLines } = require('../util.js')

const test = readLines(`be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`)
const input = readLines()

const easyDigits = new Set([2, 4, 3, 7])

function countEasyDigits (entries) {
    return entries.reduce((sum, entry) => {
        const [signal, output] = entry.split(' | ')
        const outputDigits = output.split(' ')
        return sum + outputDigits.filter(digit => easyDigits.has(digit.length)).length
    }, 0)
}

function difference (large, small) {
    const difference = new Set()
    for (const element of large) {
        if (!small.has(element)) {
            difference.add(element)
        }
    }
    return difference
}

function resolveEntry (entry) {
    const [signal, output] = entry.split(' | ').map(part => part.split(' '))

    // 2 -> 1
    // 3 -> 7
    // 4 -> 4
    // 5 -> 2, 3, 5
    // 6 -> 0, 6, 9
    // 7 -> 8
    const byLength = signal.reduce((byLength, digit) => {
        if (!byLength[digit.length]) byLength[digit.length] = []
        byLength[digit.length].push(new Set([...digit]))
        return byLength
    }, {})

    const digits = {
        '1': byLength[2][0],
        '4': byLength[4][0],
        '7': byLength[3][0],
        '8': byLength[7][0]
    }

    for (const digit of byLength[5]) {
        if (difference(digit, digits[4]).size === 3) {
            digits[2] = digit
        } else if (difference(digit, digits[1]).size === 3) {
            digits[3] = digit
        } else {
            digits[5] = digit
        }
    }

    for (const digit of byLength[6]) {
        if (difference(digit, digits[1]).size === 5) {
            digits[6] = digit
        } else if (difference(digit, digits[4]).size === 2) {
            digits[9] = digit
        } else {
            digits[0] = digit
        }
    }

    const byCode = {}
    for (const digit in digits) {
        byCode[Array.from(digits[digit]).sort().join()] = digit
    }

    return +output.map(digit => byCode[[...digit].sort().join()]).join('')
}

function sumEntries (entries) {
    return entries.reduce((sum, entry) => sum + resolveEntry(entry), 0)
}

console.log('8-1-test:', countEasyDigits(test))
console.log('8-1:', countEasyDigits(input))

console.log('8-2-test:', sumEntries(test))
console.log('8-2:', sumEntries(input))
