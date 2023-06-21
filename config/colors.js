/*
    esc:
        \x1b[0m = reset

    old school:       
        0-7 = normal, bold, faint, ital, underline, blink, blinkfast, reverse 
        30-37 = orig fg: black, red, green, yellow, blue, magenta, cyan, white
        40-47 = orig bk: black, red, green, yellow, blue, magenta, cyan, white
        90-97 = bright fg: black, red, green, yellow, blue, magenta, cyan, white
        100-107 = bright bk: black, red, green, yellow, blue, magenta, cyan, white

    8-bit first param:
        38 = 256-color foreground,
        48 = 256-color background,

    8-bit second param:
        5 = 256-color mode (0-255)  e.g. \x1b[38;5;128m
        2 = 24-bit mode (r;g;b)     e.g. \x1b[38;2;128;255;128m

    more: https://en.wikipedia.org/wiki/ANSI_escape_code
*/

const esc = '\x1b['

const end = 'm'

const fg = {
    red: '1;31',
    orange: '38;5;208',
    yellow: '1;33',
    green: '1;32',
    blue: '1;34',
    violet: '1;35',
    pink: '38;5;201',
    magenta: '38;5;198',
    cyan: '1;36',
    r: '0',
}

const bg = {
    red: '41',
    orange: '48;5;208',
    yellow: '43',
    green: '42',
    blue: '44',
    violet: '45',
    pink: '48;5;201',
    magenta: '48;5;198',
    cyan: '46',
    r: '0',
}

const color = (col) => `${esc}${fg[col]}${end}`
const bgcolor = (col) => `${esc}${bg[col]}${end}`

module.exports = { color, bgcolor }
