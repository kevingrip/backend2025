import {promises as fs} from 'fs';


class ProductManager {
    
    constructor(file){
        this.path = file;
    }

    async readParfum() {
        try {
            const data = await fs.readFile(this.path,"utf-8");
            return JSON.parse(data)
        } catch (error) {
            console.error("error al leer los perfumes:",error)
            return[]
        }
    } 

    async writeParfum(parfums){
        try {
            await fs.writeFile(this.path ,JSON.stringify(parfums, null, 2), 'utf-8');
        } catch (error) {
            console.error("Error al guardar el perfume:", error);
            throw error;
        }
    }

    async readParfumById(id) {
        try {
            const parfums = await this.readParfum();
            const productId = parfums.find((perfume) => perfume.id === parseInt(id))
            if (productId){
                return productId
            }else{
                return ("No se encuentra perfume con ese ID")
            }
            
        } catch (error) {
            console.error("error en el id del perfume:",error)
            
        }
    }

    async postNewProduct(body){
        try {
            const parfums = await this.readParfum();
            let newId = 1 
            let ids = []
            parfums.forEach(perfumes => {
                ids.push(perfumes.id)
            });
            while (ids.includes(newId)) {
                newId++;
            }
            
            const {title, description, code, price, status, stock, category, thumbnails} = body;

            if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails){
                throw new Error("Faltan datos: title,description,code,price,status,stock,category,thumbnails")
            }else{
                const checkCode = parfums.find((perfumes) => perfumes.code === code)
                if (checkCode){
                    console.error("Error de subida. El codigo esta duplicado")
                    throw new Error("Error de subida. El codigo esta duplicado")
                }else{
                    const newParfum = {
                        id:newId,
                        title,
                        description,
                        code,
                        price,
                        status,
                        stock,
                        category,
                        thumbnails
                    }        
                    parfums.push(newParfum)
                    await this.writeParfum(parfums)
                    return (newParfum)
                }            
            }        
        } catch (error) {
            throw error
        }
        
    }

    async deleteProductId(id){
        try {
            const parfums = await this.readParfum();        
            const deleteParfum = parfums.find(product => product.id === parseInt(id));        
            if (deleteParfum){
                const filteredProduct = parfums.filter(product => product.id != id);
                console.log(filteredProduct)
                await this.writeParfum(filteredProduct)
                //await fs.writeFile(this.path, JSON.stringify(filteredProduct, null, 2),'utf-8')
                return ("Producto borrado ID: "+id)
            }else{
                return ("ID no encontrado")
            }
        } catch (error) {
            console.error(error.message)
        }
        
    }

    async updateProduct(body){
        try {
            const parfums = await this.readParfum();
            const findParfum = parfums.find(product => product.id === parseInt(body.id));      
            if (findParfum){
                findParfum.title = body.title || findParfum.title;
                findParfum.description = body.description || findParfum.description;
                findParfum.code = body.code || findParfum.code;
                findParfum.price = body.price || findParfum.price;
                findParfum.status = body.status !== undefined ? body.status : findParfum.status;
                findParfum.stock = body.stock || findParfum.stock;
                findParfum.category = body.category || findParfum.category;
                findParfum.thumbnails = body.thumbnails || findParfum.thumbnails;

                await this.writeParfum(parfums)

                return findParfum;
            }else{
                return ("ID no encontrado")
            }
        } catch (error) {
            console.error(error.message)
        }
        
    }
}

export default ProductManager;