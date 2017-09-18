const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utils');

function spider(url, callback) {
	const filename = utilities.urlToFilename(url);
	// Checks if the URL was already downloaded by verifying that the corresponding file was not already created
	fs.exists(filename, exists => {        
		if(!exists) {
			// If the file is not found, the URL is downloaded using the following line of code
			console.log(`Downloading ${url}`);
			request(url, (err, response, body) => {      
				if(err) {
					callback(err);
				} else {
					// Then, we make sure whether the directory that will contain the file exists or not
					mkdirp(path.dirname(filename), err => {    //[3]
						if(err) {
							callback(err);
						} else {
							// Finally, we write the body of the HTTP response to the filesystem:
							fs.writeFile(filename, body, err => { //[4]
								if(err) {
									callback(err);
								} else {
									callback(null, filename, true);
								}
							});
						}
					});
				}
			});
		} else {
			callback(null, filename, false);
		}
	});
}

spider(process.argv[2], (err, filename, downloaded) => {
	if(err) {
		console.log(err);
	} else if(downloaded){
		console.log(`Completed the download of "${filename}"`);
	} else {
		console.log(`"${filename}" was already downloaded`);
	}
});