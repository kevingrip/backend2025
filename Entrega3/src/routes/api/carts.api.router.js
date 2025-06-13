import express from 'express'
import CartCollectionManager from '../../manager/cartManagerMdb.js'

const router = express.Router()

const dbCartManager = new CartCollectionManager();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;
        const products = await dbCartManager.getAllCart(limit)
        res.status(200).send({ status: "success", payload: products })
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }

})

router.get('/:cid', async (req, res) => {
    try {
        const productId = req.params.cid;
        console.log("cartid:", productId)
        const product = await dbCartManager.getCartById(productId)

        res.status(200).send({ status: "success", payload: product });
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }

})

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const cartEmpty = await dbCartManager.addEmptyCart();
        res.status(200).send({ status: "success", payload: cartEmpty });
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }

})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const prodId = req.params.pid;

        const addProd = await dbCartManager.addProductCart(cartId, prodId);
        res.status(200).send({ status: "success", payload: addProd });
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid;
        const quantity = req.body.quantity;
        const productCartUpdate = await dbCartManager.updateQuantity(cartId, prodId, quantity)
        res.status(200).send({ status: 3, payload: productCartUpdate });
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const bodyProducts = req.body;
        const cartId = req.params.cid;

        const updateArrayProducts = await dbCartManager.updateArray(bodyProducts,cartId)

        res.status(200).send({ status: 3, payload: updateArrayProducts });
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartDeleteById = await dbCartManager.deleteProductsFromCart(cartId);
        res.status(200).send({ status: 3, payload: cartDeleteById });
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const prodDeleteByCart = await dbCartManager.deleteProdByCart(cartId, prodId);
        res.status(200).send({ status: 3, payload: prodDeleteByCart });
    } catch (error) {
        res.status(500).send({ status: "error", message: "error del servidor" })
    }
})

export default router;