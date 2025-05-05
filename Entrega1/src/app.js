import express from 'express'
import logger from 'morgan'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './manager/productManager.js'; // Importamos la clase
import CartManager from './manager/cartManager.js'; // Importamos la clase


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express() // el server es un objeto 

const cartFile = path.join(__dirname,"db/carts.json");
const cartManager = new CartManager(cartFile);

const parfumFile = path.join(__dirname,"db/products.json");


const productManager = new ProductManager(parfumFile)

app.use(express.json()); //* la data por BODY pase de undefined a ser un {}
app.use(express.urlencoded({ extended: true })); //* es para específica de FORM sea {}
app.use(logger("dev"))


app.get("/api/products", async(req,res)=>{
    try {
        const parfums = await productManager.readParfum();
        res.status(200).json(parfums)
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

app.get("/api/products/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const parfums = await productManager.readParfumById(id);
        res.status(200).json(parfums)
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

app.post("/api/products", async(req,res)=>{
    try {
        const newProductCharged = req.body;
        const result = await productManager.postNewProduct(newProductCharged)       
        

        res.status(201).json(result)
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

app.delete("/api/products/:id", async(req,res)=>{
    try {
        const { id } = req.params;
        const result  = await productManager.deleteProductId(id)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

app.put("/api/products/:id", async(req,res)=>{
    try {
        const update = req.body;
        update.id = parseInt(req.params.id)
        const result  = await productManager.updateProduct(update)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

//cart

app.get('/api/carts',async (req,res)=>{
    const limit = parseInt(req.query.limit) || 0;
    const products = await cartManager.getCart(limit)
    res.status(200).send(products)
})

app.get('/api/carts/:cid', async(req,res) => {
    const productId = parseInt(req.params.cid);
    if (productId <= 0 || isNaN(productId)) {
        res.status(400).send({ status: 0, payload: [], error: 'Se requiere id numérico mayor a 0' });
    }else{
        const product = await cartManager.getCartId(productId)
        res.status(200).send(product)
    }
    
})

app.post('/api/carts/', async(req,res) => {
    console.log(req.body);
    const cartEmpty = await cartManager.newCartEmpty();
    res.status(200).send(cartEmpty);
})

app.post('/api/carts/:cid/product/:pid', async(req,res) => {
    // console.log(req.body);
    const cartId = parseInt(req.params.cid);
    const prodId = parseInt(req.params.pid);
    if ((prodId <= 0 || isNaN(prodId))||(cartId <= 0 || isNaN(cartId))) {
        res.status(400).send({error: 'Se requiere id numérico mayor a 0' });
    }else{
        const addProd = await cartManager.addProductCart(cartId,prodId);
        res.status(200).send(addProd);
    }
})

export default app;