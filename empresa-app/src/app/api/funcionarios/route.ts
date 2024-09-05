import { NextResponse } from 'next/server';
import prisma from '../../lib/PrismaClient'; 

export async function POST(request: Request) {
  try {
    const { nome, salario, endereco, dependentes, projetos } = await request.json();

    const newFuncionario = await prisma.funcionario.create({
      data: {
        nome,
        salario,
        endereco: endereco ? {
          create: endereco
        } : undefined,
        dependentes: dependentes ? {
          create: dependentes
        } : undefined,
        projetos: projetos ? {
          create: projetos.map((projetoId: any) => ({ projetoId }))
        } : undefined
      }
    });

    return NextResponse.json(newFuncionario, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating funcionario' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const funcionarios = await prisma.funcionario.findMany({
      include: {
        endereco: true,
        dependentes: true,
        projetos: {
          include: {
            projeto: true // Inclua detalhes do projeto se necessário
          }
        }
      }
    });

    return NextResponse.json(funcionarios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching funcionarios' }, { status: 500 });
  }
}
