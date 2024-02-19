import express from 'express'
import cors from 'cors'
import apiAuthRouter from './auth/index.mjs'
import apiTestRouter from './test.mjs'
import apiPostRouter from './post.mjs'

const router = express.Router()

const opt = {
  origin: ['http://n0.tel', 'http://dev.n0.tel'],
  methods: ['GET', 'POST', 'PUT'],
  optionsSuccessStatus: 200,
}

router.use('/test', cors(opt), apiTestRouter)
router.use('/auth', cors(opt), apiAuthRouter)
router.use('/post', cors(opt), apiPostRouter)

export default router
