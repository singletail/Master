import express from 'express'

const router = express.Router()

router.get('/test', async (req, res) => {
  const jsonres = {
    "status": "ok",
    "geo": req.userData.geo,
    "tracker": req.tracker,
  }
  res.json(jsonres);
})


export default router
