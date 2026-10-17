require('dotenv').config();
const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory store for PKCE state and active tokens
const stateStore = new Map();
let currentToken = null;
let refreshToken = null;

// Helper to determine the callback redirect URI
function getRedirectUri(req) {
  if (process.env.SWIGGY_REDIRECT_URI) {
    return process.env.SWIGGY_REDIRECT_URI;
  }
  // If hosted on Render or behind proxy, prefer forwarded proto/host
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  return `${proto}://${host}/api/auth/callback/swiggy`;
}

// 1. Health check & status
app.get('/', (req, res) => {
  res.json({
    status: 'Swiggy MCP Integration Backend is running',
    authenticated: !!currentToken,
    login_url: '/login',
    token_url: '/api/auth/token',
  });
});

// 2. Automated PKCE Login Initiation
app.get('/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  // Store verifier for this state (valid for 10 minutes)
  stateStore.set(state, codeVerifier);
  setTimeout(() => stateStore.delete(state), 10 * 60 * 1000);

  const redirectUri = getRedirectUri(req);
  const authUrl = `https://mcp.swiggy.com/auth/authorize?response_type=code&client_id=swiggy-mcp&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=mcp:tools&state=${state}`;

  console.log(`Initiating login with state: ${state}`);
  console.log(`Redirect URI: ${redirectUri}`);

  res.redirect(authUrl);
});

// 3. OAuth Callback endpoint — exchanges code immediately
app.get('/api/auth/callback/swiggy', async (req, res) => {
  console.log('Received callback from Swiggy:', req.query);
  const { code, state, error, error_description } = req.query;

  if (error) {
    console.error('OAuth Error:', error, error_description);
    return res.status(400).send(`<h3>Authentication failed: ${error_description || error}</h3>`);
  }

  if (!code) {
    return res.status(400).send('<h3>No authorization code provided in the callback.</h3>');
  }

  // Retrieve matching code_verifier from PKCE generation
  const codeVerifier = stateStore.get(state);
  stateStore.delete(state);

  if (!codeVerifier) {
    console.warn(`No code_verifier found for state ${state}. PKCE verification may fail if initiated outside /login.`);
  }

  const redirectUri = getRedirectUri(req);

  try {
    console.log('Exchanging authorization code with https://mcp.swiggy.com/auth/token ...');

    const tokenRes = await fetch('https://mcp.swiggy.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        code_verifier: codeVerifier || 'access_token_vivek',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Token exchange failed:', tokenData);
      return res.status(tokenRes.status).send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2 style="color: #e53935;">Authentication Failed</h2>
            <p>Swiggy returned an error during token exchange:</p>
            <pre style="background:#f5f5f5; padding:15px; border-radius:8px; display:inline-block; text-align:left;">${JSON.stringify(
              tokenData,
              null,
              2
            )}</pre>
            <br/><br/>
            <a href="/login" style="background:#FC8019; color:white; padding:10px 20px; text-decoration:none; border-radius:6px; font-weight:bold;">Try Logging In Again</a>
          </body>
        </html>
      `);
    }

    currentToken = tokenData.access_token;
    refreshToken = tokenData.refresh_token;

    console.log('Successfully acquired Swiggy MCP Access Token!');

    const sampleCurl = `curl --location 'https://mcp.swiggy.com/food' \\
--header 'Authorization: Bearer ${currentToken}' \\
--header 'Content-Type: application/json' \\
--header 'Accept: application/json, text/event-stream' \\
--data '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
        "name": "get_addresses",
        "arguments": {}
    },
    "id": 1
}'`;

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Swiggy MCP - Authenticated</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; background: #f7f9fa; color: #333; }
            .card { background: white; max-width: 720px; margin: 0 auto; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); text-align: center; }
            h2 { color: #2C8B3D; margin-top: 0; }
            .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
            textarea { width: 100%; height: 90px; padding: 12px; font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace; font-size: 13px; border-radius: 8px; border: 1px solid #ccc; box-sizing: border-box; resize: none; word-break: break-all; }
            .btn { background: #FC8019; color: white; border: none; padding: 12px 28px; font-size: 15px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 12px; }
            .btn:hover { background: #e66f12; }
            pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; text-align: left; overflow-x: auto; font-size: 12px; font-family: monospace; }
            .section-title { text-align: left; margin-top: 24px; font-size: 15px; font-weight: 600; color: #444; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🎉 Authentication Successful!</h2>
            <div class="badge">Valid for 5 Days</div>
            <p>Your Swiggy MCP Access Token has been issued:</p>
            <textarea id="tokenBox" readonly>${currentToken}</textarea>
            <br/>
            <button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('tokenBox').value); this.innerText = 'Copied to Clipboard!';">Copy Access Token</button>

            <div class="section-title">Ready-to-run cURL (Get Delivery Addresses):</div>
            <pre><code>${sampleCurl.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>

            <p style="color: #888; font-size: 13px; margin-top: 20px;">
              You can also test this token via your backend API: <a href="/api/food/test" target="_blank">/api/food/test</a>
            </p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Error during token exchange:', err);
    res.status(500).send(`<h3>Server error during authentication: ${err.message}</h3>`);
  }
});

// 4. API endpoint to fetch the current active token (for programmatic clients/agents)
app.get('/api/auth/token', (req, res) => {
  if (!currentToken) {
    return res.status(401).json({ error: 'Not authenticated yet. Visit /login to authenticate.' });
  }
  res.json({
    access_token: currentToken,
    token_type: 'Bearer',
  });
});

// 5. Test endpoint to verify token directly against Swiggy Food MCP
app.get('/api/food/test', async (req, res) => {
  if (!currentToken) {
    return res.status(401).json({ error: 'Not authenticated. Visit /login first.' });
  }

  try {
    const swiggyRes = await fetch('https://mcp.swiggy.com/food', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: 'get_addresses',
          arguments: {},
        },
        id: 1,
      }),
    });

    const data = await swiggyRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to call Swiggy MCP', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Login URL: http://localhost:${port}/login`);
  console.log(`Callback URL: http://localhost:${port}/api/auth/callback/swiggy`);
});
