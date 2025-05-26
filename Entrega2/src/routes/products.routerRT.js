import express from 'express'
import ProductManager from '../manager/productManager.js'; // Importamos la clase
import path from 'path';
import {io} from '../../index.js'

const router = express.Router()

const parfumFile = path.join("./src/db/products.json");

const productManager = new ProductManager(parfumFile)


router.get("/", async(req,res)=>{
    try {
        const parfums = await productManager.readParfum();
        //res.status(200).json(parfums)
        res.render("pages/realTimeProducts", { parfums });

    } catch (error) {
        res.status(500).send("error del servidor")
    }
})


router.post("/", async(req,res)=>{
    try {
        const newProductCharged = req.body;
        const result = await productManager.postNewProduct(newProductCharged)
        io.emit('nuevoProductoCargado',result)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.delete("/:id", async(req,res)=>{
    try {
        const productId = parseInt(req.params.id);
        if (productId<=0){
            res.status(500).send("El ID debe ser mayor a 0")
        }else{
            const result = await productManager.deleteProductId(productId)
            console.log(result)
            io.emit('productoEliminado',productId)
            res.status(201).json(`Producto borrado ID: ${productId}`)
        }
        
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

export default router;