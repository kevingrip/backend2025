import app from './src/app.js'
import dotenv from 'dotenv'
import {Server} from 'socket.io'
import http from 'http'

dotenv.config();
const PORT = process.env.PORT

const server = http.createServer(app);

const io = new Server(server);

io.on('connection', (socket) =>{
    console.log("Conectado")

    socket.on('mensajeCliente',(data)=>{
        console.log("msj del cliente: ",data)
    

    socket.emit('msj Servidor', `Servidor recibio ${data}`)
    })


socket.on('disconnect', () =>{
    console.log("cliente desconectado")
    })
})

export { io };

server.listen(PORT, () =>{
    console.log(`Servidor + socket corriendo en http://localhost:${PORT}/api/realTimeProducts`)
})