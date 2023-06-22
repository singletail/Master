import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  if (!req.userData.isRegistered) {
    res.redirect('/auth/login')
  } else {
    const data = {
      title: 'User',
      msg: 'Page to come.',
    }
    res.render('user', { data, user: req.userData })
  }
})

router.get('/register', async (req, res) => {
  if (!req.userData.isRegistered) {
    res.redirect('/auth/login')
  } else {
    const data = {
      title: 'User',
      msg: 'Page to come.',
    }
    res.render('user', { data, user: req.userData })
  }
})

export default router
