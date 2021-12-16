const { readLines } = require('../util.js')

const TYPE_LITERAL = 4
const LENGTH_TYPE_LENGTH = 0
const LENGTH_TYPE_CONTENTS = 1

const test = readInput('9C0141080250320F1802104A08')
const input = readInput()

function readInput (input) {
    const [packet] = readLines(input)
    const bits = packet
        .split('')
        .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
        .join('')
        .split('')
    return parsePacket(bits)
}

function takeBits (packet, n) {
    return parseInt(packet.splice(0, n).join(''), 2)
}

function parsePacket (packet) {
    const version = takeBits(packet, 3)
    const type = takeBits(packet, 3)

    if (type === TYPE_LITERAL) {
        let number = ''
        let last = 0
        while (!last) {
            last = !takeBits(packet, 1)
            number += packet.splice(0, 4).join('')
        }
        return { version, type, literal: parseInt(number, 2) }
    } else {
        const lengthTypeId = takeBits(packet, 1)
        let subPackets = []

        if (lengthTypeId === LENGTH_TYPE_LENGTH) {
            const totalBitLength = takeBits(packet, 15)
            const totalBits = packet.splice(0, totalBitLength)
            while (totalBits.length) {
                subPackets.push(parsePacket(totalBits))
            }
        } else if (lengthTypeId === LENGTH_TYPE_CONTENTS) {
            const numberOfSubPackets = takeBits(packet, 11)
            subPackets = Array(numberOfSubPackets)
                .fill(0)
                .map(() => parsePacket(packet))
        }
        return { version, type, subPackets }
    }
}

function sumVersionNumbers (packet) {
    if (packet.type === TYPE_LITERAL) {
        return packet.version
    } else {
        return packet.version + packet.subPackets.reduce((sum, packet) => {
            return sum + sumVersionNumbers(packet)
        }, 0)
    }
}

function evaluate (packet) {
    if (packet.type === TYPE_LITERAL) {
        return packet.literal
    }

    const subPackets = packet.subPackets.map(evaluate)

    switch (packet.type) {
        case 0:
            return subPackets.reduce((a, b) => a + b)
        case 1:
            return subPackets.reduce((a, b) => a * b)
        case 2:
            return Math.min(...subPackets)
        case 3:
            return Math.max(...subPackets)
        case 5:
            return subPackets[0] > subPackets[1]
        case 6:
            return subPackets[0] < subPackets[1]
        case 7:
            return subPackets[0] == subPackets[1]
    }
}

console.log('16-1-test:', sumVersionNumbers(test))
console.log('16-1:', sumVersionNumbers(input))

console.log('16-2-test:', evaluate(test))
console.log('16-2:', evaluate(input))
