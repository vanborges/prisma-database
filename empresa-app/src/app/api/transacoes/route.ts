import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * /api/transacoes:
 *   post:
 *     summary: Cria uma nova transação
 *     tags: [Transações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contaId:
 *                 type: integer
 *               valor:
 *                 type: number
 *               dataTransacao:
 *                 type: string
 *                 format: date-time
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transação criada com sucesso
 *       500:
 *         description: Erro ao criar transação
 */
router.post('/', async (req, res) => {
  const { contaId, valor, dataTransacao, descricao } = req.body;
  try {
    const transacao = await prisma.transacao.create({
      data: { contaId, valor, dataTransacao, descricao },
    });
    res.json(transacao);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

export default router;
