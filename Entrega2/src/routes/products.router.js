import express from 'express'
import ProductManager from '../manager/productManager.js'; // Importamos la clase
import path from 'path';

const router = express.Router()

const parfumFile = path.join("./src/db/products.json");

const productManager = new ProductManager(parfumFile)

// router.get("/vista", async (req, res) => {
//     try {
//         const parfums = await productManager.readParfum();
//     } catch (error) {
//         res.status(500).send("Error al renderizar los perfumes");
//     }
// });

router.get("/", async(req,res)=>{
    try {
        const parfums = await productManager.readParfum();
        //res.status(200).json(parfums)
        res.render("pages/home", { parfums });

    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.get("/:id", async(req,res)=>{
    try {
        const productId = parseInt(req.params.id);
        if (productId<=0){
            res.status(500).send("El ID debe ser mayor a 0")
        }else{
            const parfums = await productManager.readParfumById(productId);
            //res.status(200).json(parfums)
            res.render("pages/home", { parfums: [parfums] });
        }        
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.post("/", async(req,res)=>{
    try {
        const newProductCharged = req.body;
        const result = await productManager.postNewProduct(newProductCharged)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.delete("/:id", async(req,res)=>{
    try {
        const productId = parseInt(req.params.id);
        if (productId<=0){
            res.status(500).send("El ID debe ser mayor a 0")
        }else{
            const result  = await productManager.deleteProductId(productId)
            res.status(201).json(result)
        }
        
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.put("/:id", async(req,res)=>{
    try {
        const update = req.body;
        update.id = parseInt(req.params.id)
        const result  = await productManager.updateProduct(update)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

export default router;