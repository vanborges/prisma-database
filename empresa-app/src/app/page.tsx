import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>POC ORM utilizando PostgreSQL</h2>
      <p className={styles.subtitle}>Integração de ORM com Prisma e PostgreSQL</p>
      <p className={styles.description}>
        Nesta aula prática, você vai aprender a criar um ORM utilizando o Prisma com um banco de dados PostgreSQL.
      </p>
      <p className={styles.description}>
        Vamos explorar operações CRUD e como realizar migrações de dados de maneira eficiente em um ambiente de desenvolvimento Next.js.
      </p>
      <p className={styles.description}>
        Acesse a documentação da API gerada pelo Swagger clicando no link abaixo:
      </p>
      <a href="http://localhost:3000/api/swagger" className={styles.link}>
        Documentação da API
      </a>
    </div>
  );
}