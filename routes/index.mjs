import express from 'express'
import pretty from '../lib/pretty.js'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

const c = {
    ['r']: '<span class="cRed">',
    ['o']: '<span class="cOrange">',
    ['y']: '<span class="cYellow">',
    ['g']: '<span class="cGreen">',
    ['b']: '<span class="cBlue">',
    ['v']: '<span class="cViolet">',
    ['p']: '<span class="cPink">',
    ['c']: '<span class="cCyan">',
    ['w']: '<span class="cWhite">',
    ['x']: '</span>',
}

router.get('/test', async (req, res) => {

  const msg = JSON.stringify(req.session)

  const prettyRequest = pretty.req(req, ', ')
  const prettyHeaders = pretty.headers(req, ', ')
  let debug = `${c.r}req: {${c.x} ${prettyRequest} ${c.r}}${c.x}<br />`
  debug += '<br />'
  debug += `${c.r}headers: {${c.x} ${prettyHeaders} ${c.r}}${c.x}<br />`
  

  // cookies
  let cMsg = ''
  if (req.cookies) {
    for (const [key, value] of Object.entries(req.cookies)) {
      cMsg += `${c.c}req.cookies.${key}: ${c.x}`
      const cVal = await pretty.cookie(value)
      cMsg += `${cVal}<br />`
    }
  } else {
    cMsg += 'No cookies'
  }

  debug += '<br />'
  debug += cMsg

  const data = {
    title: 'Test',
    msg: msg,
    debug: debug,
  }
  res.render('test', { data })
})



export default router
