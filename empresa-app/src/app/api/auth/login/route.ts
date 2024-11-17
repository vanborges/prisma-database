import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../lib/PrismaClient";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta";
export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { success: false, message: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { success: false, message: "Senha incorreta" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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
