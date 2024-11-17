import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/PrismaClient";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    // Validação básica
    if (!email || !senha) {
      return NextResponse.json(
        { success: false, message: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar o usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: "E-mail ou senha inválidos" },
        { status: 401 }
      );
    }

    // Comparar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { success: false, message: "E-mail ou senha inválidos" },
        { status: 401 }
      );
    }

    // Gerar JWT
    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Resposta com o token e os dados do usuário
    return NextResponse.json(
      {
        success: true,
        message: "Login bem-sucedido",
        data: {
          usuario: { id: usuario.id, nome: usuario.nomeDeUsuario, email: usuario.email },
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
