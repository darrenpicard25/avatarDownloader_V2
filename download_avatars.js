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
    if (data.message === 'Not Found') {
      console.log('Could not find repoOwner or repoName');
    } else {}
    //Sending data to the callback function
      cb(err, data);
    });
}

function downloadImageByURL(url, filePath) {
  let writingError = false;
  let getError = false;
  let responseError = false;
  request.get(url)
       .on('error', function (err) {
         getError = true;
       })
       .on('response', function (response) {
          if (response.statusCode !== 200) {
            responseError = true;
          }
       })
       .pipe(fs.createWriteStream(filePath))
       //Piping Errors
       .on('error', function (err) {
        console.log('An Error has occured. Please Ensure writing path is correct');
        return false;
       })
       .on('finish', function () {
        return true;
       });
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
    let numberOfDownloads = 0;
    let numberOfAttempts = 0;
    for (let person of results) {
      numberOfAttempts ++;
      let avatarURL = person.avatar_url;
      let savePath = `./avatars/${person.login}.jpg`;
      let numberOfDownloads = 0;
      if (downloadImageByURL(avatarURL, savePath)) {
        numberOfDownloads += 1;
      }
    }
    console.log('Number of Attempts: ', numberOfAttempts);
    console.log('Number of Downloads: ', numberOfDownloads);
  });
}

//Call of the main function
main();


