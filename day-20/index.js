const { readInput: readFile, readLines } = require('../util.js')

const test = readInput(`..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`)
const input = readInput()

function readInput (input) {
    input = input || readFile()
    const [algorithm, image] = input.trim().split('\n\n')
    return {
        algorithm,
        image: Object.fromEntries(readLines(image).flatMap((line, y) => {
            return line
                .split('')
                .map((pixel, x) => [[x, y].join(), [x, y, pixel]])
                .filter(pixel => pixel[1][2] === '#')
        }))
    }
}

const NEIGHBOURS = [
    [-1, -1],
    [ 0, -1],
    [ 1, -1],
    [-1,  0],
    [ 0,  0],
    [ 1,  0],
    [-1,  1],
    [ 0,  1],
    [ 1,  1],
]

function isOutOfRange (x, y, dimensions) {
    return x < dimensions[0] || x > dimensions[1] ||
           y < dimensions[2] || y > dimensions[3]
}

function getDimensions (image) {
    const dimensions = [Infinity, -Infinity, Infinity, -Infinity]
    for (const coord in image) {
        if (coord === 'border') continue
        const [x, y] = image[coord]
        if (x < dimensions[0]) dimensions[0] = x
        if (x > dimensions[1]) dimensions[1] = x
        if (y < dimensions[2]) dimensions[2] = y
        if (y > dimensions[3]) dimensions[3] = y
    }
    return dimensions
}

function displayImage (image, borderWidth = 4) {
    const dimensions = getDimensions(image)
    const border = image.border ? '=' : '-'
    const width = dimensions[1] - dimensions[0] + 11
    const horizontalBorder = border.repeat(width) + '\n'

    process.stdout.write(horizontalBorder.repeat(borderWidth))

    for (let y = dimensions[2] - 1; y <= dimensions[3] + 1; y++) {
        process.stdout.write(border.repeat(borderWidth))
        for (let x = dimensions[0] - 1; x <= dimensions[1] + 1; x++) {
            if ([x, y].join() in image) {
                process.stdout.write('#')
            } else {
                process.stdout.write('.')
            }
        }
        process.stdout.write(border.repeat(borderWidth) + '\n')
    }

    process.stdout.write(horizontalBorder.repeat(borderWidth))
}

function enhance (image, algorithm) {
    const dimensions = getDimensions(image)
    const enhanced = {}

    for (let y = dimensions[2] - 1; y <= dimensions[3] + 1; y++) {
        for (let x = dimensions[0] - 1; x <= dimensions[1] + 1; x++) {
            let neighbours = ''
            for (const [dx, dy] of NEIGHBOURS) {
                let coord
                if (isOutOfRange(x + dx, y + dy, dimensions)) {
                    coord = 'border'
                } else {
                    coord = [x + dx, y + dy].join()
                }
                neighbours += +(coord in image)
            }

            if (algorithm[parseInt(neighbours, 2)] === '#') {
                enhanced[[x, y]] = [x, y]
            }
        }
    }

    if (image.border && algorithm[511] === '.') {
        delete enhanced.border
    } else if (!image.border && algorithm[0] === '#') {
        enhanced.border = true
    }

    return enhanced
}

function countPixels ({ algorithm, image }, steps) {
    while (steps--) {
        image = enhance(image, algorithm)
    }
    return Object.keys(image).length
}

console.log('20-1-test:', countPixels(test, 2))
console.log('20-1:', countPixels(input, 2))

console.log('20-2-test:', countPixels(test, 50))
console.log('20-2:', countPixels(input, 50))
