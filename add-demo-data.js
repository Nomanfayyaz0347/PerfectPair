const https = require('https');
const http = require('http');

// Function to make HTTP request
function makeRequest(url, method = 'POST') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const req = lib.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Add demo data
async function addDemoData() {
  try {
    console.log('🔄 Adding 20 demo profiles to database...');
    
    const response = await makeRequest('http://localhost:3000/api/demo', 'POST');
    
    if (response.status === 200) {
      console.log('✅ Success:', response.data.message);
      console.log(`📊 Added ${response.data.profiles.length} profiles using ${response.data.method}`);
      console.log('\n📋 Demo Profiles Added:');
      response.data.profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.name} - ${profile.age} years - ${profile.occupation}`);
      });
    } else {
      console.log('❌ Error:', response.data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Failed to add demo data:', error.message);
    console.log('\n💡 Make sure your Next.js server is running on http://localhost:3000');
    console.log('   Run: npm run dev');
  }
}

// Run the script
addDemoData();