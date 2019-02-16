const request = require('request');
const fs = require('fs');
require('dotenv').config();

// This function sends the request to the specified repoOwner and name
function getRepoContributors(repoOwner, repoName, cb) {
  let options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-agent': 'request',
      'Authorization' : process.env.token   //GitHub token added using dotenv
    }
  };
  request(options, function(err, res, body) {
    let data = JSON.parse(body);
    //Sending data to the callback function
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

//Main function
function main () {
  let [owner, repo] = process.argv.slice(2);
  //Simply checks to ensure both values were entered. Will stop function if one or the other was not
  if (!(owner && repo)) {
    console.log('\nPlease enter the owner and repo you wish to download from in the program\n');
    return;
  }
  getRepoContributors (owner, repo, (err, results) => {
    console.log('Errors: ', err);
    for (let person of results) {
      let avatarURL = person.avatar_url;
      let savePath = `./avatars/${person.login}.jpg`;
      downloadImageByURL(avatarURL, savePath);
    }
  });
}

//Call of the main function
main();


