"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado para exibir um loading
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      // Armazena userId e token no localStorage
      localStorage.setItem("userId", String(data.data.usuario.id)); // Certifique-se de armazenar como string
      localStorage.setItem("token", data.data.token);

      setErrorMessage("");
      console.log("Login bem-sucedido:", data.data);

      // Redireciona para o dashboard
      router.push("./dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="loginBox">
        <h2 className="title">Controle Financeiro</h2>
        <form onSubmit={handleLogin} className="form">
          {errorMessage && <p className="error">{errorMessage}</p>}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="registerText">
          Não tem uma conta?{" "}
          <Link href="/usuarios/register" className="registerLink">
            Cadastre-se
          </Link>
        </p>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background-color: #f0f2f5;
        }
        .loginBox {
          width: 350px;
          padding: 40px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .title {
          font-size: 24px;
          font-weight: 600;
          color: #4caf50;
          margin-bottom: 20px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .input {
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
          transition: all 0.3s ease;
        }
        .input:focus {
          border-color: #4caf50;
        }
        .button {
          padding: 12px;
          font-size: 16px;
          background-color: #4caf50;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }
        .error {
          color: red;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .registerText {
          margin-top: 15px;
          font-size: 14px;
          color: #666;
        }
        .registerLink {
          color: #4caf50;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
