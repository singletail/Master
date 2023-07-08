import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  if (!req.userdata.isRegistered) {
    res.redirect('/auth/login')
  } else {
    const data = {
      title: 'User',
      msg: 'Page to come.',
    }
    res.render('user', { data, user: req.userdata })
  }
})

router.get('/register', async (req, res) => {
  if (!req.userdata.isRegistered) {
    res.redirect('/auth/login')
  } else {
    const data = {
      title: 'User',
      msg: 'Page to come.',
    }
    res.render('user', { data, user: req.userdata })
  }
})

export default router
