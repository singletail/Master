const sym = {
  singletail: '⒤',
  emerg: 'Ⲳ',
  alert: '㗙',
  crit: '㡉',
  error: '⼌',
  warn: '㭅',
  notice: '⹣',
  info: '㭄',
  debug: '䆺',
  code: '⒓',
  server: '⒔',
  db: '⹨',
  timer: '⼧',
  event: '⼘',
  config: '⺌',
  plugin: '⒩',
  key: '⺑',
  geo: '⺙',
  user: '⻓',
  mac: '⻛',
  win: '⻜',
  linux: '⻝',
  cookie: '⼿',
  fingerprint: '⼗',
  alarm: '⼏',
  certificate: '⻼',
  git: '㯮',
  reload: '㨼',
  power: '㨬',
  globe: '⺍',
}

const g = (val) => sym[val] || 'ⱥ'

export default g