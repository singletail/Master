const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const col = {
  red: '\x1b[1;31m',
  orange: '\x1b[38;5;208m',
  yellow: '\x1b[1;33m',
  green: '\x1b[1;32m',
  blue: '\x1b[1;34m',
  violet: '\x1b[1;35m',
  pink: '\u001b[38;5;201m',
  magenta: '\u001b[38;5;198m',
  cyan: '\x1b[1;36m',
  r: '\x1b[0m',
};

const pathstringcolor = () => {
  let err = new Error();
  Error.captureStackTrace(err);
  // const pathstringcolor = (err) => {
  let stackStr = err.stack;
  let color_string = `${col.orange}[unknown]${col.r}`;
  let stack = stackStr.split('\n');
  console.log('');
  console.log(
    `${col.magenta}_________________________________________________________`
  );
  console.log(stack);
  if (stack.length > 2) {
    let stack_line = stack[stack.length - 2];
    console.log('________________ stack_line');
    console.log(stack_line);
    let stack2 = stack_line.split('/');
    let stack3 = stack2[stack2.length - 1].split(':');
    let directory = stack2[stack2.length - 2];
    let filename = stack3[0];
    let line_num = stack3[1];
    let char_num = stack3[2].slice(0, stack3[2].length - 1);
    color_string = `⑯${col.orange}[${directory}/${filename}]${col.r}${col.yellow}[${line_num}:${char_num}]${col.r}`;
  }
  return color_string;
};

const pathstring = (stackStr) => {
  let path_string = `[unknown]`;
  let stack = stackStr.split('\n');
  console.log('');
  console.log('_________________________________________________________');
  console.log(stack);
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

const infoString = {
  emerg: `${col.red}[🔥EMERG🔥]`,
  alert: `${col.red}[ALERT]`,
  crit: `${col.red}[CRIT]`,
  error: `${col.red}[ERROR]`,
  warn: `${col.orange}[WARN]`,
  notice: `${col.cyan}[NOTICE]`,
  info: `${col.green}[INFO]`,
  debug: `${col.violet}[DEBUG]`,
};

const fileFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}]${label}[${level}]: ${message}`;
});

const consoleFormat = printf(({ level, message, label, timestamp }) => {
  return `${col.red}[${timestamp}]${col.r}${label}${infoString[level]} ${message}${col.r}`;
});

const colorLabel = (filename) => {
  let pA = filename.split('/');
  return `${col.orange}[${pA[pA.length - 2]}]${col.r}${col.yellow}[${
    pA[pA.length - 1]
  }]${col.r}`;
};

const plainLabel = (filename) => {
  let pA = filename.split('/');
  return `[${pA[pA.length - 2]}][${pA[pA.length - 1]}]`;
};

const log = (mod) => {
  return createLogger({
    transports: [
      new transports.Console({
        format: combine(
          timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
          label({ label: colorLabel(mod.filename) }),
          consoleFormat
        ),
      }),
      new transports.File({
        filename: '/var/dev/ai/server/log.log',
        format: combine(
          timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
          label({ label: plainLabel(mod.filename) }),
          fileFormat
        ),
      }),
    ],
  });
};

module.exports = log;
