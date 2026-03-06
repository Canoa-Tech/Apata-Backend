import express from 'express'
import UserController from '../controllers/UserController.js'
import { autenticar } from '../middlewares/auth.js' // << ADICIONE ESTA LINHA!

const router = express.Router()

// Rotas de Usuário
router.post('/usuarios', UserController.criar)
router.post('/login', UserController.login)
router.get('/usuarios', UserController.listar)
router.get('/usuarios/:id', UserController.listarId)
router.put('/usuarios/:id', UserController.atualizar)
router.delete('/usuarios/:id', UserController.deletar)

// Rotas de Sessão Igual ao projeto antigo
router.post('/logout', UserController.logout)
router.post('/atualizatoken', autenticar, UserController.renovarToken) 

export default router