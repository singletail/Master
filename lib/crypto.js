import crypto from 'node:crypto'

const pseudo = {
    create: (val, length = 8, keyChar = 3) => {
        const ps1 = crypto.randomBytes(keyChar - 1).toString('hex')
        const ps2 = crypto.randomBytes(length - keyChar - 1).toString('hex')
        return `${ps1}-${val}-${ps2}`
    },
    read: (val, keyChar = 3) => {
        if (!val) return null
        return val.charAt(keyChar)
    },
    string: (length = 32) => {
        return crypto.randomBytes(length).toString('hex')
    },
    number: (length = 32) => {
        return crypto.randomBytes(length).readUIntBE(0, length)
    },
    hex: (length = 32) => {
        return crypto.randomBytes(length).toString('hex')
    },
    base64: (length = 32) => {
        return crypto.randomBytes(length).toString('base64')
    },
    url: (length = 32) => {
        return crypto
            .randomBytes(length)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')
    },
}

export default pseudo
