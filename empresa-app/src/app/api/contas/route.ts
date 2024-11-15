import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * /api/contas:
 *   post:
 *     summary: Cria uma nova conta
 *     tags: [Contas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               tipoDeConta:
 *                 type: string
 *               saldo:
 *                 type: number
 *     responses:
 *       200:
 *         description: Conta criada com sucesso
 *       500:
 *         description: Erro ao criar conta
 */
router.post("/", async (req, res) => {
  const { usuarioId, tipoDeConta, saldo } = req.body;
  try {
    const conta = await prisma.conta.create({
      data: { usuarioId, tipoDeConta, saldo },
    });
    res.json(conta);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

/**
 * @swagger
 * /api/contas:
 *   get:
 *     summary: Lista todas as contas
 *     tags: [Contas]
 *     responses:
 *       200:
 *         description: Lista de contas
 *       500:
 *         description: Erro ao obter contas
 */
router.get("/", async (req, res) => {
  try {
    const contas = await prisma.conta.findMany();
    res.json(contas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter contas" });
  }
});

export default router;
