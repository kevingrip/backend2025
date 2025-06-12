import express from 'express'
import ProductCollectionManager from '../../manager/productManagerMDB.js';
import { io } from '../../../index.js'


const router = express.Router()

const productManager = new ProductCollectionManager()

router.get("/", async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        var sort = req.query.sort || "asc";
        var direction = 1;

        const queryItem = req.query.query;
        const queryValue = req.query.value;

        let filter = {};

        if (queryItem && queryValue) {
            if (!Number.isNaN(Number(queryValue))) {
                filter[queryItem] = { $eq: Number(queryValue)};
            }else{
                filter[queryItem] = { $regex: queryValue, $options: "i" };
            }            
        }

        if (sort === "desc") {
            direction = -1
        } else {
            sort = "asc"
        }

        const result = await productManager.getAllProductsDB(page, limit, direction, filter);

        const parfums = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            sort: sort,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            limit: result.limit,
            hasAnyPage: result.hasNextPage || result.hasPrevPage || null
        }

        if (parfums.status) {
            res.render("pages/home", {
                parfums: parfums.payload,
                pagination: {
                    totalPages: parfums.totalPages,
                    page: parfums.page,
                    sort: sort,
                    hasNextPage: parfums.hasNextPage,
                    hasPrevPage: parfums.hasPrevPage,
                    nextPage: parfums.nextPage,
                    prevPage: parfums.prevPage,
                    limit: parfums.limit,
                    hasAnyPage: parfums.hasNextPage || parfums.hasPrevPage || null
                },
            });
        } else {
            res.status(404).json("error de busqueda");
        }

    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id
        console.log(productId)
        const result = await productManager.getProductByIdDB(productId);
        if (result.success) {
            res.render("pages/home", { parfums: [result.product] });
        } else {
            res.status(404).json("error de busqueda");
        }

    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.post("/", async (req, res) => {
    try {
        const newProductCharged = req.body;
        const result = await productManager.addProductDB(newProductCharged)
        if (result.success) {
            io.emit('nuevoProductoCargado', result.product)
            console.log("prod:", result)
            res.status(200).json("agregado correctamente");
        } else {
            res.status(404).json("codigo duplicado");
        }

    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        const result = await productManager.deleteProductDB(productId)

        if (result.success) {
            io.emit('productoEliminado', productId)
            res.status(200).json("borrado correctamente");
        } else {
            res.status(404).json("error de id");
        }

    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

router.put("/:id", async (req, res) => {
    try {

        const update = req.body;
        update.id = req.params.id

        const result = await productManager.updateProductDB(update)

        if (result.success) {
            io.emit('productoActualizado', result.product);
            return res.status(200).json(result.product);
        } else {
            return res.status(404).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).send("error del servidor")
    }
})

export default router;