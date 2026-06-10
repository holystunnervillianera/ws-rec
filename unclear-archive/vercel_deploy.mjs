import https from 'https';

const VERCEL_TOKEN = 'vcp_1jvk2yUutzXbXY41PlIhsrooGUVMWzUxkDZjh2yeic5PbIq3Ht2OsO2z';
const GITHUB_REPO = 'godsentaigod/expert-disco';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function deployToVercel() {
  console.log('🚀 Starting Vercel deployment via API...\n');

  try {
    // Step 1: Get user info
    console.log('Step 1: Verifying Vercel account...');
    const userRes = await makeRequest('GET', '/v2/user');
    if (userRes.status !== 200) {
      throw new Error(`Failed to verify account: ${userRes.status}`);
    }
    const userId = userRes.data.user.id;
    console.log(`✅ Account verified: ${userRes.data.user.email}\n`);

    // Step 2: Create project
    console.log('Step 2: Creating Vercel project...');
    const projectRes = await makeRequest('POST', '/v13/projects', {
      name: 'expert-disco',
      gitRepository: {
        type: 'github',
        repo: GITHUB_REPO
      },
      framework: 'vite',
      buildCommand: 'pnpm run build',
      installCommand: 'pnpm install',
      devCommand: 'pnpm run dev',
      outputDirectory: 'client/dist'
    });

    if (projectRes.status !== 201) {
      console.log(`Project creation response: ${projectRes.status}`, projectRes.data);
      throw new Error(`Failed to create project: ${projectRes.status}`);
    }
    const projectId = projectRes.data.id;
    console.log(`✅ Project created: ${projectId}\n`);

    // Step 3: Set environment variables
    console.log('Step 3: Configuring environment variables...');
    const envVars = [
      { key: 'DATABASE_URL', value: process.env.DATABASE_URL || 'postgresql://user:pass@localhost/db' },
      { key: 'JWT_SECRET', value: process.env.JWT_SECRET || 'your-jwt-secret' },
      { key: 'VITE_APP_ID', value: process.env.VITE_APP_ID || 'app-id' },
      { key: 'OAUTH_SERVER_URL', value: process.env.OAUTH_SERVER_URL || 'https://api.manus.im' },
      { key: 'VITE_OAUTH_PORTAL_URL', value: process.env.VITE_OAUTH_PORTAL_URL || 'https://oauth.manus.im' },
      { key: 'OWNER_OPEN_ID', value: process.env.OWNER_OPEN_ID || 'owner-id' },
      { key: 'OWNER_NAME', value: process.env.OWNER_NAME || 'Owner' },
      { key: 'BUILT_IN_FORGE_API_URL', value: process.env.BUILT_IN_FORGE_API_URL || 'https://forge.manus.im' },
      { key: 'BUILT_IN_FORGE_API_KEY', value: process.env.BUILT_IN_FORGE_API_KEY || 'api-key' },
      { key: 'VITE_FRONTEND_FORGE_API_KEY', value: process.env.VITE_FRONTEND_FORGE_API_KEY || 'frontend-key' },
      { key: 'VITE_FRONTEND_FORGE_API_URL', value: process.env.VITE_FRONTEND_FORGE_API_URL || 'https://forge.manus.im' },
      { key: 'STRIPE_SECRET_KEY', value: process.env.STRIPE_SECRET_KEY || 'sk_live_' },
      { key: 'VITE_STRIPE_PUBLIC_KEY', value: process.env.VITE_STRIPE_PUBLIC_KEY || 'pk_live_' },
      // { key: 'VITE_ANALYTICS_ENDPOINT', value: process.env.VITE_ANALYTICS_ENDPOINT || 'https://analytics.manus.im' },
      // { key: 'VITE_ANALYTICS_WEBSITE_ID', value: process.env.VITE_ANALYTICS_WEBSITE_ID || 'website-id' },
      { key: 'VITE_APP_TITLE', value: 'The Reality Architech' },
      { key: 'VITE_APP_LOGO', value: process.env.VITE_APP_LOGO || 'https://example.com/logo.png' }
    ];

    for (const envVar of envVars) {
      const envRes = await makeRequest('POST', `/v10/projects/${projectId}/env`, {
        key: envVar.key,
        value: envVar.value,
        target: ['production', 'preview', 'development']
      });
      if (envRes.status !== 201) {
        console.log(`Warning: Could not set ${envVar.key}: ${envRes.status}`);
      }
    }
    console.log(`✅ Environment variables configured\n`);

    // Step 4: Trigger deployment
    console.log('Step 4: Triggering deployment...');
    const deployRes = await makeRequest('POST', `/v13/projects/${projectId}/deployments`, {
      gitSource: {
        type: 'github',
        repo: GITHUB_REPO,
        ref: 'main'
      }
    });

    if (deployRes.status !== 201) {
      console.log(`Deployment response: ${deployRes.status}`, deployRes.data);
      throw new Error(`Failed to trigger deployment: ${deployRes.status}`);
    }
    const deploymentId = deployRes.data.id;
    const deploymentUrl = deployRes.data.url;
    console.log(`✅ Deployment triggered: ${deploymentId}`);
    console.log(`📍 Deployment URL: ${deploymentUrl}\n`);

    console.log('✅ Vercel deployment sequence complete!');
    console.log(`Project: https://vercel.com/godsentaigod/expert-disco`);
    console.log(`Live URL will be available at: ${deploymentUrl}`);

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployToVercel();
