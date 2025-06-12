import app from './src/app.js'
import dotenv from 'dotenv'
import { Server } from 'socket.io'
import http from 'http'
import mongoose from 'mongoose';
import CartCollectionManager from './src/manager/cartManagerMdb.js';
const dbCartManager = new CartCollectionManager();


dotenv.config();
const PORT = process.env.PORT
const mongo_uri = process.env.MONGO_DB

mongoose.connect(mongo_uri)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB', err));

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) => {
    console.log("Cliente conectado con ID:", socket.id);

    socket.on('solicitarCarrito', async (cartIdCliente) => {
        try {
            let cartId = cartIdCliente;

            if (cartId) {
                // Verificamos que el carrito exista en la base
                const carritoExiste = await dbCartManager.getCartById(cartId);

                if (!carritoExiste) {
                    console.log("El carrito no existe en la base, creando uno nuevo");
                    const nuevoCarrito = await dbCartManager.addEmptyCart();
                    cartId = nuevoCarrito.cartId;
                } else {
                    console.log("Carrito existente detectado:", cartId);
                }
            } else {
                const nuevoCarrito = await dbCartManager.addEmptyCart();
                cartId = nuevoCarrito.cartId;
                console.log("Carrito nuevo creado:", cartId);
            }

            socket.emit("carritoAsignado", { cartId });
        } catch (err) {
            console.error("Error en solicitud de carrito:", err.message);
        }
    });

    socket.on('disconnect', () => {
        console.log("Cliente desconectado");
    });
});


export { io };

server.listen(PORT, () => {
    console.log(`Servidor + socket corriendo en http://localhost:${PORT}/api/realTimeProducts`)
})