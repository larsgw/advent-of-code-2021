const { readLines } = require('../util.js')

const test = readLines(`[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`)
const input = readLines()

const OPEN_CLOSE = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
}

const ILLEGAL_CHAR_POINTS = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
}

const AUTOCOMPLETE_CHAR_POINTS = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
}

function getSyntaxErrorScore (line) {
    const stack = []
    for (const char of line) {
        if (char in OPEN_CLOSE) {
            stack.push(OPEN_CLOSE[char])
        } else if (char === stack[stack.length - 1]) {
            stack.pop()
        } else {
            return {
                corruption: ILLEGAL_CHAR_POINTS[char],
                autocomplete: 0
            }
        }
    }
    return {
        corruption: 0,
        autocomplete: stack
            .reverse()
            .reduce((score, char) => score * 5 + AUTOCOMPLETE_CHAR_POINTS[char], 0)
    }
}

function getTotalCorruptionScore (lines) {
    return lines
        .reduce((sum, line) => sum + getSyntaxErrorScore(line).corruption, 0)
}

function getTotalAutocompleteScore (lines) {
    const scores = lines
        .map(line => getSyntaxErrorScore(line).autocomplete)
        .filter(score => score !== 0)
        .sort((a, b) => a - b)
    return scores[(scores.length - 1) / 2]
}

console.log('10-1-test:', getTotalCorruptionScore(test))
console.log('10-1:', getTotalCorruptionScore(input))

console.log('10-2-test:', getTotalAutocompleteScore(test))
console.log('10-2:', getTotalAutocompleteScore(input))
