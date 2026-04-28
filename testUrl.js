const https = require('https');
https.get('https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-districts.json', (res) => {
  console.log('statusCode:', res.statusCode);
});
