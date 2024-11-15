import { PrismaClient } from '@prisma/client';
import { NextResponse } from "next/server";
import prisma from "../../../lib/PrismaClient";
import bcrypt from "bcrypt"; // Para comparar a senha

// Define a chave secreta para o JWT (pode ser configurada no .env)
// const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    // Buscar o usuário no banco de dados
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Comparar a senha fornecida com a senha criptografada no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      );
    }

    // // Opcional: Gerar um token JWT para autenticação
    // const token = jwt.sign({ userId: usuario.id, email: usuario.email }, JWT_SECRET, {
    //   expiresIn: "1h",
    // });

    // Retornar o token e os dados do usuário
    return NextResponse.json(
      {
        message: "Login bem-sucedido",
        // token,
        usuario: { id: usuario.id, nome: usuario.nomeDeUsuario, email: usuario.email },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro ao processar o login" },
      { status: 500 }
    );
  }
}