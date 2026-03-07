import express from 'express'
import PetController from '../controllers/PetController.js'
import { autenticar } from '../middlewares/auth.js' 
import upload from '../config/multer.js' 

const router = express.Router()

// Rotas de Pets
router.get('/pets', PetController.listar)
router.get('/pets/busca', PetController.listarnome) 
router.get('/pets/:id', PetController.listarId)

// Rota de Cadastro (Unificada com Autenticação e Upload)
router.post('/pets', autenticar, upload.single('file'), PetController.criar)

// Outras Rotas Protegidas
router.put(
  '/pets/:id',
  autenticar,
  upload.single('file'), // ← OBRIGATÓRIO
  PetController.atualizar
)
router.delete('/pets/:id', autenticar, PetController.deletar)

export default router