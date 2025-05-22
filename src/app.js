import express from 'express'
import routes from './routes/index.js'
import logger from 'morgan'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import handlebarsConfig from './config/hbsconfig.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express() // el server es un objeto 

app.use(logger("dev"))
app.use(express.json()); //* la data por BODY pase de undefined a ser un {}
app.use(express.urlencoded({ extended: true })); //* es para específica de FORM sea {}

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

handlebarsConfig(app,__dirname)

app.use("/api",routes)

export default app;