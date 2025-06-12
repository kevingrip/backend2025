import express from 'express'
import CartCollectionManager from '../../manager/cartManagerMdb.js';

const router = express.Router()

const dbCartManager = new CartCollectionManager();


router.get('/:cid', async (req, res) => {
    const productId = req.params.cid;
    console.log("cartid:", productId)
    const product = await dbCartManager.getCartById(productId)
    console.log(product)
    const productMap = product.list.map(item => ({
        quantity: item.quantity,
        idProduct: {
            _id: item.idProduct._id,
            title: item.idProduct.title,
            description: item.idProduct.description,
            stock: item.idProduct.stock,
            price: item.idProduct.price,
            category: item.idProduct.category,
        }
    }));

    res.render("pages/carts", {
        productos: productMap,
        pagination: {
            totalPages: product.totalPages,
            page: product.page,
            hasNextPage: product.hasNextPage,
            hasPrevPage: product.hasPrevPage,
            nextPage: product.nextPage,
            prevPage: product.prevPage,
            limit: product.limit,
            hasAnyPage: product.hasNextPage || product.hasPrevPage || null
        },
    });

})

export default router;