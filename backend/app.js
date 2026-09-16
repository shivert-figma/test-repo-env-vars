import express from 'express';

const DEFAULT_APP_NAME = 'Test Repo Env Vars';
const DEFAULT_WELCOME_MESSAGE = 'Welcome! Configure this message with WELCOME_MESSAGE.';

export function createApp(env = process.env) {
  const app = express();

  app.use(express.json());

  app.get('/api/config', (_request, response) => {
    response.json({
      appName: env.APP_NAME || DEFAULT_APP_NAME,
      welcomeMessage: env.WELCOME_MESSAGE || DEFAULT_WELCOME_MESSAGE
    });
  });

  app.get('/api/health', (_request, response) => {
    response.json({
      status: 'ok',
      service: 'backend',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime())
    });
  });

  app.post('/api/ping', (request, response) => {
    response.json({
      message: 'Backend received the request.',
      received: request.body ?? null
    });
  });

  app.post('/api/experiment', (_request, response) => {
    if (!env.EXPERIMENT_TOKEN) {
      response.status(500).json({
        error: {
          code: 'MISSING_ENV_VAR',
          variable: 'EXPERIMENT_TOKEN',
          message: 'Missing required environment variable: EXPERIMENT_TOKEN'
        }
      });
      return;
    }

    response.json({
      message: 'Experiment endpoint is enabled.',
      tokenPresent: true
    });
  });

  app.use('/api', (_request, response) => {
    response.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'API endpoint not found.'
      }
    });
  });

  return app;
}
