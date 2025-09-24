# KvantoBot Web API

## 🏗️ Architecture Overview

This is the **Node.js backend API** for the KvantoBot ecosystem, providing Discord OAuth authentication, bot data management, and serving as the bridge between the web frontend and Discord services.

### Tech Stack
- **Node.js 20** with Express.js
- **Discord OAuth 2.0** integration
- **CORS-enabled** for frontend communication
- **Azure App Service** for hosting and deployment

## 🌐 Live URLs

- **Production API**: https://kvantobot-api.azurewebsites.net
- **Frontend**: https://kvantobot-web.netlify.app
- **Repository**: https://github.com/Andreashoj/kvantobot-api

## 🔗 System Integration

### 1. **API Endpoints**
```javascript
// Health Check
GET /api/health
Response: { "status": "ok", "service": "KvantoBot Web API", "timestamp": "..." }

// Discord OAuth Token Exchange
POST /api/auth/discord/callback
Body: { "code": "discord_auth_code" }
Response: { "access_token": "...", "user": { "id": "...", "username": "..." } }
```

### 2. **Discord OAuth Flow Handling**
```
Frontend sends auth code → Backend exchanges for token → Backend fetches user data → Returns user info
```

### 3. **Architecture Role**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Angular Web   │───▶│   Node.js API   │───▶│  Discord OAuth  │
│   (Frontend)    │◀───│   (This API)    │◀───│   & Services   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │  Discord Bot    │
                    │  (Future Link)  │
                    └─────────────────┘
```

## 📁 Project Structure

```
kvantobot-api/
├── server.js              # Main server application
├── package.json           # Dependencies and scripts
├── web.config             # Azure App Service configuration
├── .github/
│   └── workflows/
│       └── azure-deploy.yml # GitHub Actions deployment
├── .gitignore             # Git ignore patterns
└── README.md              # Basic project documentation
```

## 🔧 Core Functionality

### **Express Server Configuration**
- **CORS enabled** for frontend communication
- **JSON parsing** middleware
- **Environment-based configuration**
- **Error handling** and logging

### **Discord OAuth Integration**
- **Token exchange** with Discord API
- **User information fetching** from Discord
- **Secure credential handling**
- **Frontend callback support**

### **Health Monitoring**
- **Health check endpoint** for monitoring
- **Azure App Service integration**
- **Request logging** and debugging

## 🚀 Deployment Pipeline

### **GitHub Actions → Azure App Service**
```yaml
name: Deploy API to Azure
on:
  push:
    branches: [ main ]

# Automatic deployment process:
# 1. Checkout code
# 2. Setup Node.js 20
# 3. Install dependencies (npm ci)
# 4. Build artifacts
# 5. Deploy to Azure using publish profile
```

### **Azure Configuration**
- **Node.js 20 runtime** on Linux
- **Environment variables** for secrets
- **Basic authentication enabled** for deployments
- **Auto-scaling** and health monitoring

## 🔐 Environment Variables

### **Required Configuration**
```bash
# Discord OAuth Credentials
DISCORD_CLIENT_ID=1419232209528688650
DISCORD_CLIENT_SECRET=***SECRET***
DISCORD_REDIRECT_URI=https://kvantobot-web.netlify.app/auth/callback

# CORS Configuration
FRONTEND_URL=https://kvantobot-web.netlify.app

# Runtime Configuration
NODE_ENV=production
PORT=8080  # Azure sets this automatically
```

### **Development vs Production**
```javascript
// Development
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = 'http://localhost:4200';

// Production (Azure)
const PORT = process.env.PORT || 8080;  // Azure uses 8080
const FRONTEND_URL = process.env.FRONTEND_URL;
```

## 🔄 OAuth Flow Implementation

### **Discord Authorization Code Exchange**
```javascript
async function exchangeCodeForToken(code) {
  const tokenData = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI
  });

  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenData.toString()
  });

  return await response.json();
}
```

### **User Information Retrieval**
```javascript
async function fetchDiscordUserInfo(accessToken) {
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  
  return await response.json();
}
```

## 🤖 Integration with KvantoBot Ecosystem

### **1. Web Authentication Bridge**
- **Handles Discord OAuth** for web users
- **Validates user tokens** and sessions
- **Provides user data** to frontend
- **Maintains session state**

### **2. Bot Data Interface (Future)**
```javascript
// Future endpoints for bot integration
GET /api/bot/stats          // Bot statistics and status
GET /api/bot/guilds         // Discord servers bot is in
POST /api/bot/command       // Execute bot commands
GET /api/gamba/leaderboard  // Gaming leaderboards
```

### **3. Shared Data Layer**
- **User preferences** across web and bot
- **Gaming statistics** and leaderboards
- **Server configurations** and settings
- **Bot command history** and logs

## 🔗 Frontend Integration

### **CORS Configuration**
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
```

### **API Response Format**
```javascript
// Success Response
{
  "access_token": "discord_user_token",
  "user": {
    "id": "123456789",
    "username": "andreas7544",
    "discriminator": "0000",
    "avatar": "avatar_hash",
    "email": "user@example.com"
  }
}

// Error Response
{
  "error": "Error description",
  "details": "Additional error context"
}
```

## 🔄 Development Workflow

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Runs on http://localhost:3001 with hot reload

# Start production mode
npm start
# → Production server on configured PORT
```

### **Testing API**
```bash
# Health check
curl https://kvantobot-api.azurewebsites.net/api/health

# Test OAuth (with valid code)
curl -X POST https://kvantobot-api.azurewebsites.net/api/auth/discord/callback \
  -H "Content-Type: application/json" \
  -d '{"code":"discord_auth_code_here"}'
```

### **Deployment**
```bash
# Automatic via pipeline
git add .
git commit -m "feat: your changes"
git push origin main
# → Triggers automatic deployment to Azure
```

## 🛡️ Security Features

### **Environment Security**
- **Secrets stored** in Azure App Service configuration
- **No credentials** committed to repository
- **HTTPS enforced** in production
- **CORS properly configured** for frontend only

### **Discord Integration Security**
- **OAuth 2.0 flow** with proper token exchange
- **Secure token handling** (not stored long-term)
- **User data privacy** compliance
- **Request validation** and error handling

### **Production Hardening**
- **Basic authentication enabled** for deployment
- **Health monitoring** and alerting
- **Request logging** for debugging
- **Error handling** without exposing internals

## 🔗 Related Components

### **Frontend Web** (`kvantobot-web`)
- Consumes this API for authentication
- Makes requests to `/api/auth/discord/callback`
- Hosted on Netlify with automatic deployment
- Repository: https://github.com/Andreashoj/kvantobot-web

### **Discord Bot** (`Kvantobot2`)
- Independent Discord bot application
- Future integration via shared API endpoints
- Local/server deployment (separate from web)
- Repository: Local project directory

## 📊 Monitoring & Logging

### **Azure App Service Monitoring**
- **Application Insights** integration
- **Health endpoint monitoring** (`/api/health`)
- **Performance metrics** and alerting
- **Log streaming** and diagnostics

### **Request Logging**
```javascript
// Request logging for debugging
console.log('🔵 Running on Azure App Service');
console.log('✅ Discord OAuth callback received');
console.log('🔧 Processing authentication request');
```

## 📝 Future Enhancements

### **Bot Integration API**
- **Bot status monitoring** endpoints
- **Command execution** via web interface
- **Server management** and configuration
- **Real-time bot data** streaming

### **User Management**
- **Session management** and persistence
- **User preferences** storage
- **Role-based access** control
- **Admin dashboard** functionality

### **Gaming Features**
- **Leaderboard API** for gamba system
- **Statistics tracking** and analytics
- **Achievement system** integration
- **Tournament management** features

---

*This API serves as the backbone of the KvantoBot web ecosystem, bridging Discord services with modern web applications.*