import express from 'express'
const router = express.Router()
import productsRouter from './products.router.js'
import cartsRouter from './carts.router.js'
import uploadRouter from './upload.router.js'


router.use("/products", productsRouter)
router.use("/carts", cartsRouter)
router.use("/upload", uploadRouter)

export default router