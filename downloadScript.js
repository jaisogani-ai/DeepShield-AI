const fs = require('fs');
const http = require('https');
fs.mkdirSync('./public', { recursive: true });
const file = fs.createWriteStream('./public/india.json');
http.get('https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States', function(response) {
  response.pipe(file);
});
