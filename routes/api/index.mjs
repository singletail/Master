import express from 'express'
import cors from 'cors'
import apiAuthRouter from './auth/index.mjs'
import apiUserRouter from './user.mjs'
import apiTestRouter from './test.mjs'

const router = express.Router()

var opt = {
  origin: ['http://n0.tel', 'http://dev.n0.tel'],
  methods: ['GET', 'POST', 'PUT'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.use('/user', cors(opt), apiUserRouter)
router.use('/test', cors(opt), apiTestRouter)
router.use('/auth', cors(opt), apiAuthRouter)

export default router
