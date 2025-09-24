require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Azure App Service specific configuration
if (process.env.WEBSITE_HOSTNAME) {
  console.log('🔵 Running on Azure App Service');
  console.log('🔧 Host:', process.env.WEBSITE_HOSTNAME);
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'KvantoBot Web API',
    timestamp: new Date().toISOString()
  });
});

// Discord OAuth token exchange
app.post('/api/auth/discord/callback', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    console.log('Received OAuth callback with code:', code.substring(0, 10) + '...');

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);
    
    if (!tokenResponse.access_token) {
      console.error('Failed to get access token:', tokenResponse);
      return res.status(400).json({ error: 'Failed to get access token' });
    }

    console.log('Successfully exchanged code for token');

    // Get user info
    const userInfo = await fetchDiscordUserInfo(tokenResponse.access_token);
    console.log('Fetched user info for:', userInfo.username);

    res.json({
      access_token: tokenResponse.access_token,
      user: userInfo
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Helper function to exchange authorization code for access token
async function exchangeCodeForToken(code) {
  const tokenData = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI
  });

  console.log('Exchanging code with Discord...');
  
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenData.toString()
  });

  const result = await response.json();
  
  if (!response.ok) {
    console.error('Discord token exchange failed:', result);
    throw new Error(`Token exchange failed: ${result.error_description || result.error}`);
  }

  return result;
}

// Helper function to fetch Discord user info
async function fetchDiscordUserInfo(accessToken) {
  console.log('Fetching user info from Discord...');
  
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const result = await response.json();
  
  if (!response.ok) {
    console.error('Failed to fetch user info:', result);
    throw new Error(`Failed to fetch user info: ${result.message}`);
  }

  return result;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KvantoBot Web API running on port ${PORT}`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;