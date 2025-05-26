import express from 'express'
import productsRouter from './products.router.js'
import rtProductsRouter from './products.routerRT.js' //productos usando socket io
import cartsRouter from './carts.router.js'
import uploadRouter from './upload.router.js'

const router = express.Router()

router.use("/products", productsRouter)
router.use("/realtimeproducts", rtProductsRouter)
router.use("/carts", cartsRouter)
router.use("/uploadFile", uploadRouter)

export default router