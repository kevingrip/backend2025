import express from 'express'
import CartManager from '../manager/cartManager.js'; // Importamos la clase
import path from 'path';

const router = express.Router()

const cartFile = path.join("./src/db/carts.json");

const cartManager = new CartManager(cartFile);

router.get('/',async (req,res)=>{
    try {
        const limit = parseInt(req.query.limit)
        if (limit < 0) {
            return res.status(400).json({ error: '"limit" debe ser un número positivo' });
        }else{
            const products = await cartManager.getCart(limit)
            res.status(200).send(products)
        }
        
    } catch (error) {
        res.status(500).send("error del servidor")
    }    
})

router.get('/:cid', async(req,res) => {
    try {
        const productId = parseInt(req.params.cid);
        if (productId <= 0 || isNaN(productId)) {
            res.status(400).send({ status: 0, payload: [], error: 'Se requiere id numérico mayor a 0' });
        }else{
            const product = await cartManager.getCartId(productId)
            res.status(200).send(product)
        }
    } catch (error) {
        res.status(500).send("error del servidor")
    }        
})

router.post('/', async(req,res) => {
    try {
        console.log(req.body);
        const cartEmpty = await cartManager.newCartEmpty();
        res.status(200).send(cartEmpty);
    } catch (error) {
        res.status(500).send("error del servidor")
    }
    
})

router.post('/:cid/product/:pid', async(req,res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const prodId = parseInt(req.params.pid);
        if ((prodId <= 0 || isNaN(prodId))||(cartId <= 0 || isNaN(cartId))) {
            res.status(400).send({error: 'Se requiere id numérico mayor a 0' });
        }else{
            const addProd = await cartManager.addProductCart(cartId,prodId);
            res.status(200).send(addProd);
        }
    } catch (error) {
        res.status(500).send("error del servidor")
    }    
})

export default router;