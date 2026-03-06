import { PrismaClient } from "@prisma/client";
import cloudinary from "../services/cloudinary.js"; // Garanta que o caminho está correto

const prisma = new PrismaClient();

export default {
  // CREATE - Com trava de limite de 5 pets
  async criar(req, res) {
    try {
      // 1. Trava de Segurança: Limite de 5 itens ativos por usuário
      const qtd = await prisma.pet.count({
        where: { ownerId: req.userId, deleted_at: null },
      });

      if (qtd >= 5) {
        return res
          .status(403)
          .json({ error: "Limite de 5 animais por conta atingido" });
      }

      const { nome, especie, porte, sexo, descricao, tutelado, contato } = req.body;
      let fotoUrl = null;
      let publicId = null;

      // 2. Upload para Cloudinary (se houver arquivo)
      if (req.file) {
        const resultado = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "pets_apata" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          uploadStream.end(req.file.buffer);
        });

        fotoUrl = resultado.secure_url;
        publicId = resultado.public_id;
      }

      const novoPet = await prisma.pet.create({
        data: {
          nome,
          especie,
          porte,
          sexo,
          descricao,
          contato,
          tutelado: tutelado === "true" || tutelado === true,
          aprovado: true, // Adicione esta linha aqui para garantir
          adotado: false,
          foto: fotoUrl,
          public_idfoto: publicId,
          ownerId: req.userId,
          deleted_at: null
        },
      });

      res.status(201).json(novoPet);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erro ao cadastrar pet", details: error.message });
    }
  },

  // READ ALL - retorna todos os pets, sem nenhum filtro
  async listar(req, res) {
    try {
      const pets = await prisma.pet.findMany({
  where: {
    OR: [
      { deleted_at: null },
      { deleted_at: { isSet: false } }
    ]
  },
  orderBy: { createdAt: "desc" }
})

      res.status(200).json(pets);
    } catch (error) {
      console.error("Erro ao listar:", error);
      res.status(500).json({ error: "Erro ao buscar animais" });
    }
  },

  // READ BY ID
  async listarId(req, res) {
    try {
      const pet = await prisma.pet.findFirst({
        where: { id: req.params.id, deleted_at: null },
      });

      if (!pet)
        return res.status(404).json({ message: "Animal não encontrado" });
      res.status(200).json(pet);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar detalhes" });
    }
  },

  // UPDATE - Com troca de imagem e limpeza no Cloudinary
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosAtuais = await prisma.pet.findFirst({
        where: { id, deleted_at: null }
      });

      if (!dadosAtuais)
        return res.status(404).json({ error: "Pet não encontrado" });

      let dataUpdate = { ...req.body };

      // Se o usuário estiver enviando uma NOVA foto
      if (req.file) {
        // 1. Deleta a foto antiga do Cloudinary
        if (dadosAtuais.public_idfoto) {
          await cloudinary.uploader.destroy(dadosAtuais.public_idfoto);
        }

        // 2. Sobe a foto nova
        const resultado = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "pets_apata" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          uploadStream.end(req.file.buffer);
        });

        dataUpdate.foto = resultado.secure_url;
        dataUpdate.public_idfoto = resultado.public_id;
      }

      const petAtualizado = await prisma.pet.updateMany({
        where: {
          id,
          deleted_at: null
        },
        data: dataUpdate
      });

      res.status(200).json(petAtualizado);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar pet" });
    }
  },

  // DELETE - Soft Delete com limpeza de imagem
  async deletar(req, res) {
    try {
      const pet = await prisma.pet.findUnique({ where: { id: req.params.id } });
      if (!pet) return res.status(404).json({ error: "Pet não encontrado" });

      // Apaga a imagem do Cloudinary para não ocupar espaço à toa
      if (pet.public_idfoto) {
        await cloudinary.uploader.destroy(pet.public_idfoto);
      }

      // Soft Delete
      await prisma.pet.update({
        where: { id: req.params.id },
        data: {
          deleted_at: new Date(),
          foto: null, // Limpa a URL pois a imagem foi deletada do cloud
          public_idfoto: null,
        },
      });

      res
        .status(200)
        .json({ message: "Animal e imagem removidos com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar" });
    }
  },
};
