import swaggerJSDoc, { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0', // Especifique a versão do OpenAPI aqui
    info: {
      title: 'API de Funcionários',
      version: '1.0.0',
      description: 'API para gerenciar funcionários',
    },
  },
  apis: ['./src/app/api/**/*.ts'], // Caminho para os arquivos de rotas da API
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;