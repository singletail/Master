import express from 'express'
import config from '../../config/config.mjs'
import { send } from '../../modules/smtp.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

router.post('/send', async (req, res) => {
  let email = req.body.email
  let subject = req.body.subject
  let text = req.body.text
  let html = req.body.html

  let mailOptions = {
    from: `"${config.smtp.from}" <${config.smtp.user}>`,
    to: email,
    subject: subject,
    text: text,
    html: html,
  }
  log.info(`sending email: ${JSON.stringify(mailOptions)}`)
  let { statusCode, statusMsg } = await send(mailOptions)
  const jsonres = { status: statusMsg }
  res.set('Content-Type', 'application/json')
  res.sendStatus(statusCode).send(jsonres)
  res.end()
})

export default router
