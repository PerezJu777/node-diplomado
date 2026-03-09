import pino from 'pino';

const logger = pino({
  transport: {
    targets: [ // <--- Esta es la clave que faltaba
      {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:dd/mm/yyyy HH:mm:ss',
          ignore: 'pid,hostname', // Opcional: limpia un poco la consola
        },
      },
      {
        target: 'pino/file',
        options: {
          destination: 'app.log',
          mkdir: true, 
        },
      },
    ],
  },
});

export default logger;