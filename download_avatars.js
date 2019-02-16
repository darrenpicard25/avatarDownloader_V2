const request = require('request');
const GITHUB_TOKEN = require('./secrets.js');
const fs = require('fs');

function getRepoContributors(repoOwner, repoName, cb) {
       // curl https://api.github.com/repos/jquery/jquery/contributors
  let options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-agent': 'request',
      'Authorization' : GITHUB_TOKEN.token
    }
  };
  request(options, function(err, res, body) {
    let data = JSON.parse(body);
    cb(err, data);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
       })
       .pipe(fs.createWriteStream(filePath));
}


getRepoContributors ('jquery', 'jquery', (err, results) => {
  console.log('Errors: ', err);
  for (let person of results) {
    let avatarURL = person.avatar_url;
    let savePath = `./avatars/${person.login}.jpg`;
    downloadImageByURL(avatarURL, savePath);
  }
  // console.log('Results: ', results);
});

