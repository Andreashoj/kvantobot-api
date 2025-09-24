# KvantoBot Web API

Backend API server for the KvantoBot web application, providing Discord OAuth authentication and bot integration endpoints.

## Features

- Discord OAuth 2.0 authentication
- CORS-enabled for frontend integration
- RESTful API endpoints
- Environment-based configuration

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with your Discord OAuth credentials:
```
PORT=3001
NODE_ENV=development
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:4200/auth/callback
FRONTEND_URL=http://localhost:4200
```

3. Run the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth/discord/callback` - Discord OAuth token exchange

## Deployment

This API is designed to be deployed to Azure App Service with GitHub Actions CI/CD pipeline.