import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'World Cup Kits API',
    description:
      'API documentation for the World Cup Kits e-commerce shop (Final Project)',
    version: '1.0.0',
  },
  host: '',
  schemes: ['http', 'https'],
  securityDefinitions: {
    github_auth: {
      type: 'oauth2',
      authorizationUrl: '/login',
      flow: 'implicit',
      scopes: {},
    },
  },
  tags: [
    { name: 'Products', description: 'Operations related to products' },
    { name: 'Users', description: 'Operations related to users' },
    { name: 'Orders', description: 'Operations related to orders' },
    { name: 'Reviews', description: 'Operations related to reviews' },
  ],
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

// Genera il file swagger.json
swaggerAutogen()(outputFile, routes, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
});
