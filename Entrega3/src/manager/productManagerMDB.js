import productModel from "../models/product.model.js";

class ProductCollectionManager {
    constructor() {
    }

    getAllProductsDB = async (page, limit, direction, filter) => {
        try {
            const options = {
                page,
                limit,
                lean: true,
                sort: { price: direction }
            };
            const result = await productModel.paginate(filter, options);
            if (result) {
                return { success: true, ...result };
            } else {
                return { success: false, message: "No se encontraron productos" };
            }
        } catch (err) {
            return { success: false, message: err.message };
        }
    };


    addProductDB = async ({ title, description, price, thumbnails, code, stock, category, status }) => {

        try {

            const product = {
                title,
                description,
                price,
                code,
                stock,
                status: status ?? true,
                category,
                thumbnails
            };

            if (title && description && price && thumbnails && code && stock) {

                product.status = true;

                const codes = await productModel.find({}, 'code id');

                const productCodes = codes.map(prod => prod.code);

                if (!productCodes.includes(code)) {
                    if (codes.length === 0) {
                        product.id = 1;
                    } else {
                        let mayorProdId = 1;
                        codes.forEach(product => {

                            if (product.id > mayorProdId) {
                                mayorProdId = product.id;
                            }
                        })
                        product.id = mayorProdId + 1;
                    }

                    const mongoProduct = await productModel.create(product);
                    console.log("Producto agregado", code)
                    return { success: true, product: mongoProduct }
                }
                else {
                    console.log("El codigo ya esta agregado", code)
                    return { success: false, products: product }
                }
            }


        } catch (err) {
            return err.message;
        };
    };

    getProductByIdDB = async (id) => {
        try {
            const product = await productModel.findById(id).lean();
            if (!product) {
                return { success: false, message: "Producto no encontrado" };
            }

            return { success: true, product };

        } catch (err) {
            return err.message;
        };
    };

    updateProductDB = async (upd) => {
        try {
            console.log(upd)
            const id = upd.id
            delete upd.id
            const updatedProduct = await productModel.findByIdAndUpdate(id, upd, { new: true }).lean()

            if (!updatedProduct) {
                return { success: false, message: "Producto no encontrado" };
            } else {
                return { success: true, product: updatedProduct };
            }

        } catch (err) {
            return err.message;
        };
    };

    deleteProductDB = async (idDelete) => {
        try {
            const result = await productModel.findByIdAndDelete(idDelete)
            if (result) {
                console.log("Producto eliminado _id:", idDelete)
                return { success: true, result }

            } else {
                console.log("No se encuentra el _id:", idDelete)
                return { success: false, message: `No se encuentra el _id: ${idDelete}` }
            }
        } catch (err) {
            return err.message;
        };
    };
}

export default ProductCollectionManager;