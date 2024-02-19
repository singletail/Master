import express from 'express'
import config from '../../config/config.mjs'
import { send } from '../../modules/smtp.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

router.post('/send', async (req, res) => {
  const email = req.body.email
  const subject = req.body.subject
  const text = req.body.text
  const html = req.body.html

  const mailOptions = {
    from: `"${config.smtp.from}" <${config.smtp.user}>`,
    to: email,
    subject: subject,
    text: text,
    html: html,
  }
  log.info(`sending email: ${JSON.stringify(mailOptions)}`)
  const { statusCode, statusMsg } = await send(mailOptions)
  const jsonres = { status: statusMsg }
  res.set('Content-Type', 'application/json')
  res.sendStatus(statusCode).send(jsonres)
  res.end()
})

export default router
