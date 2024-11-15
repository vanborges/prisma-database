import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Controle Financeiro',
      version: '1.0.0',
      description: 'API para gerenciar usuários, contas, transações e categorias de transações',
    },
  },
  apis: ['./src/app/api/**/*.ts'], // Caminho para os arquivos de rotas documentados
};

const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
