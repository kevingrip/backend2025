import express from 'express'
import upload from '../../config/multer.js'

const router = express.Router()

router.post('/', upload.single('archivo'),(req,res) =>{
    res.send('Archivo subido exitosamente')
})

router.post('/mult', upload.array('archimult',3),(req,res) =>{
    res.send('Archivo subido exitosamente')
})

router.get('/', (req,res) =>{
    res.render("pages/upload")
})

export default router;