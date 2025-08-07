
import express from 'express'
const router = express.Router()


const freshRootInfoMessage = () => ({ title: 'TsExpress API', version: '1.0', date: Date() })

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(freshRootInfoMessage())
})

export default router
