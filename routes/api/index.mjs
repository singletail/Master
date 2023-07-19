import express from 'express'
import apiUserRouter from './user.mjs'
import apiTestRouter from './test.mjs'

const router = express.Router()

router.use('/user', apiUserRouter)
router.use('/test', apiTestRouter)
//router.use('/auth', apiAuthRouter)

export default router