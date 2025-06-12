import express from 'express'
import productsApiRouter from './api/products.api.router.js'
import cartsApiRouter from './api/carts.api.router.js'
import productsViewRouter from './views/products.views.router.js'
import cartsViewsRouter from './views/carts.views.router.js'
import uploadRouter from './upload/upload.router.js'


const router = express.Router()

router.use("/api/products", productsApiRouter)
router.use("/api/carts", cartsApiRouter)
router.use("/home", productsViewRouter)
router.use("/carts", cartsViewsRouter)
router.use("/uploadFile", uploadRouter)

export default router