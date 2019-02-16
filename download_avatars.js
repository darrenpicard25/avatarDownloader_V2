const request = require('request');
const GITHUB_TOKEN = require('./secrets.js');

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
    cb(err, body);
  });
}

getRepoContributors ('jquery', 'jquery', (err, results) => {
  console.log('Errors: ', err);
  // console.log('Results: ', results);
});