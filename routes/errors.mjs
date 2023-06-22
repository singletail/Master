import express from 'express'

const router = express.Router()

// 400 - Bad Request
router.get('/400', (req, res, next) => {
  const err = new Error('Bad Request')
  err.status = 400
  next(err)
})

// 404 Catch-All
router.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

export default router
