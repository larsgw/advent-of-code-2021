const { readInput: readFile, readNumberArray } = require('../util.js')

const test = readInput(`7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`)
const input = readInput()

function readInput (input) {
    if (!input) {
        input = readFile()
    }
    const [numbers, ...boards] = input.trim().split('\n\n')
    return {
        numbers: readNumberArray(numbers.split(',')),
        boards: boards.map(board => board
            .split('\n')
            .map(row => readNumberArray(row.trim().split(/\s+/g)))
        )
    }
}

function isBoardWinning (numbers, board) {
    const rows = Array(board.length).fill(0)
    const columns = Array(board[0].length).fill(0)

    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length; j++) {
            if (numbers.has(board[i][j])) {
                rows[i]++
                columns[j]++
                if (rows[i] === columns.length || columns[j] === rows.length) {
                    return true
                }
            }
        }
    }

    return false
}

function getBingoScore (markedNumbers, number, board) {
    const unmarked = board
        .flat()
        .filter(number => !markedNumbers.has(number))
        .reduce((sum, number) => sum + number, 0)
    return unmarked * number
}

function getWinningBoardScore ({ numbers, boards }) {
    for (let index = 0; index < numbers.length; index++) {
        const markedNumbers = new Set(numbers.slice(0, index + 1))
        for (const board of boards) {
            if (isBoardWinning(markedNumbers, board)) {
                const number = numbers[index]
                return getBingoScore(markedNumbers, number, board)
            }
        }
    }
}

function _printBoard (markedNumbers, board) {
    return board.map(row => {
        return row.map(number => {
            value = number.toString().padStart(2, ' ')
            return markedNumbers.has(number) ? `<${value}>` : ` ${value} `
        }).join(' ')
    }).join('\n') + '\n'
}

function getLosingBoardScore ({ numbers, boards }) {
    const losingBoards = boards.slice()

    for (let index = 0; index < numbers.length; index++) {
        const markedNumbers = new Set(numbers.slice(0, index + 1))
        for (let boardIndex = 0; boardIndex < losingBoards.length; boardIndex++) {
            const board = losingBoards[boardIndex]
            if (isBoardWinning(markedNumbers, board)) {
                if (losingBoards.length === 1) {
                    const number = numbers[index]
                    return getBingoScore(markedNumbers, number, board)
                } else {
                    losingBoards.splice(boardIndex, 1)
                    boardIndex--
                }
            }
        }
    }
}

console.log('4-1-test:', getWinningBoardScore(test))
console.log('4-1:', getWinningBoardScore(input))

console.log('4-2-test:', getLosingBoardScore(test))
console.log('4-2:', getLosingBoardScore(input))
