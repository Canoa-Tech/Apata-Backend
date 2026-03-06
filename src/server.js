import express from 'express'
import 'dotenv/config'
import usuarioRoutes from './routes/userRoutes.js' // Importando o arquivo de rotas renomeado
import cors from 'cors'
import petRoutes from './routes/petRoutes.js' // Verifique se importou isso!

const app = express()
app.use(cors())
app.use(express.json())

app.use(usuarioRoutes)
app.use(petRoutes) 
const PORT = 5000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando lindamente em http://localhost:${PORT}`)
})