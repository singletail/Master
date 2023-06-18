const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const col = {
  red: '\u001b[38;5;196m',
  orange: '\u001b[38;5;202m',
  yellow: '\u001b[38;5;226m',
  green: '\u001b[38;5;046m',
  blue: '\u001b[38;5;021m',
  violet: '\u001b[38;5;093m',
  pink: '\u001b[38;5;201m',
  magenta: '\u001b[38;5;198m',
  cyan: '\u001b[38;5;045m',
  r: '\u001b[0m',
};

const pathstringcolor = (stackStr) => {
  let color_string = `${col.orange}[unknown]${col.r}`;
  let stack = stackStr.split('\n');
  if (stack.length > 2) {
    let stack_line = stack[stack.length - 2];
    let stack2 = stack_line.split('/');
    let stack3 = stack2[stack2.length - 1].split(':');
    let directory = stack2[stack2.length - 2];
    let filename = stack3[0];
    let line_num = stack3[1];
    let char_num = stack3[2].slice(0, stack3[2].length - 1);
    color_string = `${col.orange}[${directory}/${filename}]${col.r}${col.yellow}[${line_num}:${char_num}]${col.r}`;
  }
  return color_string;
};

const pathstring = (stackStr) => {
  let path_string = `[unknown]`;
  let stack = stackStr.split('\n');
  if (stack.length > 2) {
    let stack_line = stack[stack.length - 2];
    let stack2 = stack_line.split('/');
    let stack3 = stack2[stack2.length - 1].split(':');
    let directory = stack2[stack2.length - 2];
    let filename = stack3[0];
    let line_num = stack3[1];
    let char_num = stack3[2].slice(0, stack3[2].length - 1);
    path_string = `[${directory}/${filename}][${line_num}:${char_num}]`;
  }
  return path_string;
};

const colorizeFormat = format.colorize({
  colors: {
    emerg: 'bold white redBG',
    alert: 'yellow redBG',
    crit: 'black redBG',
    error: 'red',
    warning: 'yellow',
    notice: 'green',
    info: 'blue',
    debug: 'violet',
  },
  level: true,
});

const fileFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}]${label}[${level}]: ${message}`;
});

const consoleFormat = printf(({ level, message, label, timestamp }) => {
  return `${col.red}[${timestamp}]${col.r}${label}[${level}] ${col.green}${message}`;
});

const log = createLogger({
  transports: [
    new transports.Console({
      format: combine(
        colorizeFormat,
        timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
        label({ label: pathstringcolor(new Error().stack) }),
        consoleFormat
      ),
    }),
    new transports.File({
      filename: '/var/dev/ai/server/log.log',
      format: combine(
        timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
        label({ label: pathstring(new Error().stack) }),
        fileFormat
      ),
    }),
  ],
});

module.exports = log;
