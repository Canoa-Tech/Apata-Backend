import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default {
    // CREATE (Cadastro com Hash)
    async criar(req, res) {
        try {
            const { email, name, password } = req.body

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            const novoUsuario = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: passwordHash,
                },
            })

            const { password: _, ...usuarioSemSenha } = novoUsuario
            res.status(201).json(usuarioSemSenha)
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar usuário", details: error.message })
        }
    },

    // LOGIN (Autenticação e Token)
    async login(req, res) {
        try {
            const { email, password } = req.body

            const user = await prisma.user.findUnique({ where: { email } })
            if (!user) return res.status(404).json({ error: "Usuário não encontrado" })

            const senhaCorreta = await bcrypt.compare(password, user.password)
            if (!senhaCorreta) return res.status(401).json({ error: "Senha incorreta" })

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )

            res.status(200).json({
                message: "Login realizado com sucesso!",
                token,
                user: { id: user.id, name: user.name, email: user.email }
            })
        } catch (error) {
            res.status(500).json({ error: "Erro no servidor ao logar" })
        }
    },

    //RENOVAR TOKEN Igual ao 'atualizatoken' do antigo
    async renovarToken(req, res) {
        try {
            // O ID já vem do middleware de autenticação (req.userId)
            const novoToken = jwt.sign(
                { id: req.userId },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )

            res.status(200).json({ 
                msg: "Token atualizado com sucesso", 
                token: novoToken 
            })
        } catch (error) {
            res.status(401).json({ error: "Erro ao renovar token" })
        }
    },

    // LOGOUT
    async logout(req, res) {
        // No JWT o logout é feito limpando o token no frontend, 
        // mas mantemos a rota para compatibilidade e resposta ao usuário.
        res.status(200).json({ msg: "Logout realizado com sucesso" })
    },

    // READ ALL
    async listar(req, res) {
        try {
            const usuarios = await prisma.user.findMany()
            res.status(200).json(usuarios)
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar usuários" })
        }
    },

    // READ BY ID
    async listarId(req, res) {
        try {
            const user = await prisma.user.findUnique({ where: { id: req.params.id } })
            if (!user) return res.status(404).json({ message: "Usuário não encontrado" })
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ error: "ID inválido ou erro no servidor" })
        }
    },

    // UPDATE
    async atualizar(req, res) {
        try {
            const usuarioAtualizado = await prisma.user.update({
                where: { id: req.params.id },
                data: {
                    email: req.body.email,
                    name: req.body.name,
                },
            })
            res.status(200).json(usuarioAtualizado)
        } catch (error) {
            res.status(500).json({ error: "Usuário não encontrado ou ID inválido" })
        }
    },

    // DELETE
    async deletar(req, res) {
        try {
            await prisma.user.delete({ where: { id: req.params.id } })
            res.status(200).json({ message: "Usuário deletado com sucesso!" })
        } catch (error) {
            res.status(500).json({ error: "Erro ao deletar usuário" })
        }
    },
}