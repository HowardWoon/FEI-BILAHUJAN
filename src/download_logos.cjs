const https = require('https');
const fs = require('fs');

const logos = [
  {
    id: 'JPS',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Department_of_Irrigation_and_Drainage_%28Malaysia%29_logo.svg'
  },
  {
    id: 'NADMA',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/52/National_Disaster_Management_Agency_%28Malaysia%29_logo.svg'
  },
  {
    id: 'APM',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Malaysia_Civil_Defence_Force_logo.svg'
  }
];

const downloadLogo = (logo) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };
    https.get(logo.url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${logo.id}: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const base64 = Buffer.from(data).toString('base64');
        resolve({ id: logo.id, base64: `data:image/svg+xml;base64,${base64}` });
      });
    }).on('error', reject);
  });
};

Promise.all(logos.map(downloadLogo))
  .then(results => {
    let content = 'export const officialLogos = {\n';
    results.forEach(r => {
      content += `  ${r.id}: '${r.base64}',\n`;
    });
    content += '};\n';
    fs.writeFileSync('/app/applet/src/data/logos.ts', content);
    console.log('Successfully generated logos.ts');
  })
  .catch(console.error);
