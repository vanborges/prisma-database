"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }), // Corrigido para 'senha'
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Erro ao fazer login");
        return;
      }

      // Armazena o userId e o token no localStorage
      localStorage.setItem("userId", data.data.usuario.id);
      localStorage.setItem("token", data.data.token);

      console.log("Login bem-sucedido");
      setErrorMessage(""); // Limpa a mensagem de erro em caso de sucesso

      // Redireciona para o dashboard após login bem-sucedido
      router.push("/pages/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Controle Financeiro</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>
        <p style={styles.registerText}>
          Não tem uma conta?{" "}
          <Link href="/pages/usuarios/register" style={styles.registerLink}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  },
  loginBox: {
    width: "350px",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "24px",
    fontWeight: "600" as const,
    color: "#4CAF50",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    transition: "all 0.3s ease",
    marginBottom: "10px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold" as const,
    transition: "all 0.3s ease",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  registerText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  },
  registerLink: {
    color: "#4CAF50",
    textDecoration: "none",
    fontWeight: "bold" as const,
  },
};
