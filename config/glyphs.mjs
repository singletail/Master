const sym = {
    singletail: '㌄',
    emerg: 'ネ',
    alert: '〣',
    crit: '㋟',
    error: 'ゅ',
    warn: '㊉',
    notice: '⹣',
    info: '〢', // ㉽
    debug: 'づ',
    code: '㄃',
    server: '㋅',
    db: '⹨',
    timer: 'ヾ',
    event: 'ざ',
    config: 'ヨ',
    plugin: '㋌',
    key: 'ろ',
    geo: 'ァ',
    user: '〷',
    mac: 'ぎ',
    win: '》',
    linux: '⻝',
    cookie: '㇍',
    fingerprint: 'ば',
    alarm: 'ㄕ',
    certificate: '⻼',
    git: '」',
    reload: 'ビ',
    power: '⏻',
    globe: '㊙',
}

const g = (val) => sym[val] || '〡'

export default g
