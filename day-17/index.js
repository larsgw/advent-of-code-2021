const { readLines } = require('../util.js')

const test = readInput('target area: x=20..30, y=-10..-5')
const input = readInput()

function readInput (input) {
    const target = readLines(input)[0]
    const [x1, x2, y1, y2] = target.match(/-?\d+/g)
    return { x: [+x1, +x2], y: [+y1, +y2] }
}

function getY (vy, step) {
    return vy * step - (step * (step - 1)) / 2
}

function hitsY (target, vy, n) {
    const [y1, y2] = target.y
    const y = getY(vy, Math.round(n))
    return y1 <= y && y <= y2
}

function getN (v, s) {
    const b = v + 0.5
    const D = 0.5 * Math.sqrt(4 * v ** 2 + 4 * v - 8 * s + 1)
    return [b - D, b + D]
}

function findHighestY (target) {
    const { x, y } = target
    const ybar = (y[0] + y[1]) / 2

    let vx = Math.ceil(0.5 * (Math.sqrt(8 * x[0] + 1) - 1))
    let vyMin = Math.floor(ybar / vx + (vx - 1) / 2)
    let vyMax = -y[0]

    let maxY = 0
    for (let vy = vyMin; vy < vyMax; vy++) {
        const n = getN(vy, ybar)[1]
        if (hitsY(target, vy, n)) {
            maxY = getY(vy, Math.max(0, vy + 1))
        }
    }

    return maxY
}

function hits (target, vx, vy) {
    const n1 = Math.ceil(getN(vx, target.x[0])[0])
    let n2

    if (0.5 * vx * (vx + 1) > target.x[1]) {
        n2 = Math.floor(getN(vx, target.x[1])[0])
    } else {
        n2 = Math.floor(getN(vy, target.y[0])[1])
    }

    for (let n = n1; n <= n2; n++) {
        if (hitsY(target, vy, n)) {
            return true
        }
    }
    return false
}

function countAll (target) {
    const { x, y } = target
    let vxMin = Math.ceil(0.5 * (Math.sqrt(8 * x[0] + 1) - 1))
    let vxMax = x[1]
    let vyMin = y[0]
    let vyMax = -y[0]

    let count = 0
    for (let vx = vxMin; vx <= vxMax; vx++) {
        for (let vy = vyMin; vy <= vyMax; vy++) {
            if (hits(target, vx, vy)) {
                count++
            }
        }
    }

    return count
}

console.log('17-1-test:', findHighestY(test))
console.log('17-1:', findHighestY(input))

console.log('17-2-test:', countAll(test))
console.log('17-2:', countAll(input))
