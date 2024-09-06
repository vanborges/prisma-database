import { NextResponse } from 'next/server';
import prisma from '../../lib/PrismaClient';

/**
 * @swagger
 * /api/funcionarios:
 *   post:
 *     summary: Cria um novo funcionário
 *     description: Adiciona um novo funcionário ao banco de dados, incluindo seu endereço, dependentes e projetos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do funcionário
 *                 example: "Mickey Mouse"
 *               salario:
 *                 type: string
 *                 description: Salário do funcionário
 *                 example: "3000"
 *               endereco:
 *                 type: object
 *                 properties:
 *                   rua:
 *                     type: string
 *                     description: Rua do endereço
 *                     example: "Rua da Diversão"
 *                   bairro:
 *                     type: string
 *                     description: Bairro do endereço
 *                     example: "Land of Magic"
 *                   numero:
 *                     type: integer
 *                     description: Número do endereço
 *                     example: 123
 *               dependentes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                       description: Nome do dependente
 *                       example: "Minnie Mouse"
 *                     parentesco:
 *                       type: string
 *                       description: Parentesco com o funcionário
 *                       example: "Namorada"
 *               projetos:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   description: ID do projeto
 *                   example: 1
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do funcionário
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   description: Nome do funcionário
 *                   example: "Mickey Mouse"
 *                 salario:
 *                   type: string
 *                   description: Salário do funcionário
 *                   example: "3000"
 *                 endereco:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID do endereço
 *                       example: 1
 *                     rua:
 *                       type: string
 *                       description: Rua do endereço
 *                       example: "Rua da Diversão"
 *                     bairro:
 *                       type: string
 *                       description: Bairro do endereço
 *                       example: "Land of Magic"
 *                     numero:
 *                       type: integer
 *                       description: Número do endereço
 *                       example: 123
 *                     funcionarioId:
 *                       type: integer
 *                       description: ID do funcionário associado
 *                       example: 1
 *                 dependentes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID do dependente
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         description: Nome do dependente
 *                         example: "Minnie Mouse"
 *                       parentesco:
 *                         type: string
 *                         description: Parentesco com o funcionário
 *                         example: "Namorada"
 *                       funcionarioId:
 *                         type: integer
 *                         description: ID do funcionário associado
 *                         example: 1
 *                 projetos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       funcionarioId:
 *                         type: integer
 *                         description: ID do funcionário associado
 *                         example: 1
 *                       projetoId:
 *                         type: integer
 *                         description: ID do projeto
 *                         example: 1
 *                       projeto:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID do projeto
 *                             example: 1
 *                           nome:
 *                             type: string
 *                             description: Nome do projeto
 *                             example: "Mickey e Amigos"
 *       500:
 *         description: Erro ao criar o funcionário
 */
export async function POST(request: Request) {
  try {
    const { nome, salario, endereco, dependentes, projetos } = await request.json();

    const newFuncionario = await prisma.funcionario.create({
      data: {
        nome,
        salario,
        endereco: endereco
          ? {
              create: endereco,
            }
          : undefined,
        dependentes: dependentes
          ? {
              create: dependentes,
            }
          : undefined,
        projetos: projetos
          ? {
              create: projetos.map((projetoId: any) => ({ projetoId })),
            }
          : undefined,
      },
    });

    return NextResponse.json(newFuncionario, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating funcionario' }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/funcionarios:
 *   get:
 *     summary: Retorna uma lista de funcionários
 *     description: Obtém todos os funcionários do banco de dados, incluindo seus endereços, dependentes e projetos.
 *     responses:
 *       200:
 *         description: Lista de funcionários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do funcionário
 *                     example: 1
 *                   nome:
 *                     type: string
 *                     description: Nome do funcionário
 *                     example: "Mickey Mouse"
 *                   salario:
 *                     type: string
 *                     description: Salário do funcionário
 *                     example: "3000"
 *                   endereco:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID do endereço
 *                         example: 1
 *                       rua:
 *                         type: string
 *                         description: Rua do endereço
 *                         example: "Rua da Diversão"
 *                       bairro:
 *                         type: string
 *                         description: Bairro do endereço
 *                         example: "Land of Magic"
 *                       numero:
 *                         type: integer
 *                         description: Número do endereço
 *                         example: 123
 *                       funcionarioId:
 *                         type: integer
 *                         description: ID do funcionário associado
 *                         example: 1
 *                   dependentes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: ID do dependente
 *                           example: 1
 *                         nome:
 *                           type: string
 *                           description: Nome do dependente
 *                           example: "Minnie Mouse"
 *                         parentesco:
 *                           type: string
 *                           description: Parentesco do dependente
 *                           example: "Namorada"
 *                         funcionarioId:
 *                           type: integer
 *                           description: ID do funcionário associado
 *                           example: 1
 *                   projetos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         funcionarioId:
 *                           type: integer
 *                           description: ID do funcionário associado
 *                           example: 1
 *                         projetoId:
 *                           type: integer
 *                           description: ID do projeto
 *                           example: 1
 *                         projeto:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               description: ID do projeto
 *                               example: 1
 *                             nome:
 *                               type: string
 *                               description: Nome do projeto
 *                               example: "Mickey e Amigos"
 *       500:
 *         description: Erro ao buscar os funcionários
 */
export async function GET() {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      include: {
        endereco: true,
        dependentes: true,
        projetos: {
          include: {
            projeto: true, // Inclua detalhes do projeto se necessário
          },
        },
      },
    });

    return NextResponse.json(funcionarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching funcionarios' }, { status: 500 });
  }
}