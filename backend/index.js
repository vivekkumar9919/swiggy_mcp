require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// A simple health check route
app.get('/', (req, res) => {
  res.send('Swiggy MCP Integration Backend is running!');
});

// The OAuth callback endpoint for Swiggy
app.get('/api/auth/callback/swiggy', (req, res) => {
  console.log('Received callback from Swiggy!');
  console.log('Query Parameters:', req.query);

  const { code, state, error, error_description } = req.query;

  // Handle case where user denies access or an error occurs
  if (error) {
    console.error('OAuth Error:', error, error_description);
    return res.status(400).send(`Authentication failed: ${error_description || error}`);
  }

  if (!code) {
    return res.status(400).send('No authorization code provided in the callback.');
  }

  // TODO: Exchange the authorization code for an access token
  // This typically involves making a POST request to Swiggy's token endpoint
  // with the `code`, `client_id`, `client_secret`, and `redirect_uri`.
  
  // For now, we'll just log it and send a success response
  console.log(`Authorization Code received: ${code}`);
  console.log(`State received: ${state}`);

  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: green;">Authentication Successful!</h2>
        <p>You have successfully authenticated with Swiggy.</p>
        <p>You can close this window and return to the application.</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Callback URL will be: http://localhost:${port}/api/auth/callback/swiggy`);
});
