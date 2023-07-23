import nodemailer from 'nodemailer'
import config from '../config/config.mjs'
import logger from '../config/logger.mjs'
const log = logger.child({ src: import.meta.url })

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
  tls: {
    ciphers: 'SSLv3',
  },
})

const sendPromise = async (options) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error)
      }
      resolve(info)
    })
  })
}

const send = async (mail) => {
  let mailOptions = {
    from: mail.from,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  }
  return await sendPromise(mailOptions)
}

const linkTextTemplate = ({ link }) => `
  Your magic link is here: ${link}
  It will expire in one hour.
`

const linkHTMLTemplate = ({ link }) => `
  <p>Your magic link is here: <a href="${link}">${link}</a></p>
  <p>It will expire in one hour.</p>
`

export const sendLink = async (email, link) => {
  let mailOptions = {
    from: `"${config.smtp.from}" <${config.smtp.user}>`,
    to: email,
    subject: 'n0.tel magic link',
    text: linkTextTemplate({ link }),
    html: linkHTMLTemplate({ link }),
  }
  log.info(`sending email: ${JSON.stringify(mailOptions)}`)
  return await send(mailOptions)
}

export const verifySMTP = async () => {
  log.info(`verifySMTP ${config.smtp.user} ${config.smtp.pass}`)
  transporter.verify(function (error, success) {
    if (error) {
      log.warn(`verifySMTP failed: ${error}`)
    } else {
      log.info(`verifySMTP Success: ${success}`)
    }
  })
}

/*
export const sendLink = async (email, link) => {
  log.info(
    `nodemailer ${config.smtp.host}:${config.smtp.port}`)
  log.info(`${config.smtp.user}:${config.smtp.pass}`)
  log.info(`${email} ${link}`)
  
  const mailOptions = {
    from: config.smtp.from,
    to: email,
    subject: 'n0.tel magic link',
    text: emailTemplate({ link }),
  }

  let reply = 'Unknown'
  let status = transporter.sendMail(mailOptions, (error) => {
    if (error) {
      log.error(`error sending email to ${email}: ${error}`)
      reply = 'Error sending email.'
    } else {
      log.info(`email sent to ${email}`)
      reply = `Token Sent via Email ${status}`
    }
  })
  return reply
}
*/
