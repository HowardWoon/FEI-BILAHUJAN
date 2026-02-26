const https = require('https');

const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/1/1a/Department_of_Irrigation_and_Drainage_%28Malaysia%29_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/52/National_Disaster_Management_Agency_%28Malaysia%29_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7b/Malaysia_Civil_Defence_Force_logo.svg',
  'https://upload.wikimedia.org/wikipedia/ms/8/87/Logo_Jabatan_Pengairan_dan_Saliran.svg',
  'https://upload.wikimedia.org/wikipedia/ms/5/52/National_Disaster_Management_Agency_%28Malaysia%29_logo.svg'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url}: ${e.message}`);
  });
});
