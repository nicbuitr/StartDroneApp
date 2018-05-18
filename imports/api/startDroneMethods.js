import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import PythonShell from 'python-shell';
import Ftp from 'ftp';
import fs from 'fs';
import { HTTP } from 'meteor/http';
import path from 'path';
     
export const PossibleZones = new Mongo.Collection('possible_zones');

if (Meteor.isServer) {
      // This code only runs on the server
    Meteor.publish('possibleZones', function possibleZonesPublication() {
        return PossibleZones.find();
    });

    Meteor.methods({
            async startDrone(pythonScriptPath, numberOfPicsToTake) {
                check(pythonScriptPath, String);

                var options = {
                  mode: 'text',
                  // pythonPath: 'path/to/python',
                  // pythonOptions: ['-u'], // get print results in real-time
                  // scriptPath: 'C:/Users/NicoBuitrago/Downloads/Web/StartDroneApp/BebopDrone/core/',
                  args: [numberOfPicsToTake]
                };

                let res = new Promise(
                    function(resolve, reject){
                        console.log('EXECUTING PYTHON');
                        PythonShell.run(pythonScriptPath, options, function(error, result) {
                                if(error){
                                    console.log('REJECTED ERROR');
                                    console.log(error);
                                    reject(error);
                                }
                                else{
                                    console.log('RESOLVED RESULT');
                                    console.log(result);
                                    resolve(result);
                                }
                            });
                    }
                );
                console.log(res);
                console.log('SCRIPT EXECUTED');
                return res;
            },
            async landDrone(pythonScriptPath) {
                check(pythonScriptPath, String);

                //PythonShell.run('C:/Users/NicoBuitrago/Dropbox/Uniandes/2018_10/Proyecto Grado/Tesis-Mario-Mariana-Carlos/BebopDrone/core/demo.py', function (err) {
                var options = {
                  mode: 'text',
                  // pythonPath: 'path/to/python',
                  // pythonOptions: ['-u'], // get print results in real-time
                  // scriptPath: 'C:/Users/NicoBuitrago/Downloads/Web/StartDroneApp/BebopDrone/core/',
                  // args: ['comment']
                };
                const rows = Promise.await(
                        PythonShell.run(pythonScriptPath, options, function (err, results) {
                          if (err) throw err;
                          // results is an array consisting of messages collected during execution
                          console.log('results: %j', results);
                        })
                    );
                return rows;
            },
            async checkFTPConnection(url) {
                check(url, String);

                //console.log('PATH: ' + path.resolve(__dirname, 'app/server'));
                let res = new Promise(
                    function(resolve, reject){
                        console.log('Checking FTP Status.');                       
                        var ftp = new Ftp();
                        ftp.on('ready', function() {
                            ftp.status(function(error, result) {
                                if(error){
                                    console.log('REJECTED FTP Status Check');
                                    resolve(error);
                                    console.log(error);
                                }
                                else{
                                    console.log('RESOLVED FTP Status Check');
                                    resolve(result);
                                    console.log(result);
                                }
                              ftp.end();
                            });
                        });
                        // connect to localhost:21 as anonymous 
                        ftp.connect({host: url});
                    }
                );
                return res;
            },
            async listFTPDirs(url, path) {
                check(url, String);
                check(path, String);

                let res = new Promise(
                    function(resolve, reject){
                        console.log('Listing FTP files.');                       
                        var ftp = new Ftp();
                        ftp.on('ready', function() {
                            ftp.list(path, function(error, result) {
                                if(error){
                                    console.log('REJECTED FTP File Listing');
                                    resolve(error);
                                    console.log(error);
                                }
                                else{
                                    console.log('RESOLVED FTP File Listing');
                                    resolve(result);
                                    // console.log(result);
                                }
                              // console.dir(result);
                              ftp.end();
                            });
                        });
                        // connect to localhost:21 as anonymous 
                        ftp.connect({host: url});
                    }
                );

                return res;
            },
            async getPicturesFTP(url, filePath, fileName, serverImageStorePath) {
                check(url, String);
                check(filePath, String);
                check(fileName, String);
                check(serverImageStorePath, String);

                let res = new Promise(
                    function(resolve, reject){
                        console.log('Downloading FTP file.');                       
                        var ftp = new Ftp();
                        ftp.on('ready', function() {
                            ftp.get(filePath+fileName, function(error, stream) {
                                if(error){
                                    console.log('REJECTED FTP File Download');
                                    resolve(error);
                                    console.log(error);
                                }
                                else{
                                    stream.on('close', function() {ftp.end();});                                    
                                    stream.pipe(fs.createWriteStream(serverImageStorePath+fileName)); 
                                    console.log('RESOLVED RESULT GOT:', fileName);
                                    resolve("Downloaded File: '" + fileName + "'");  
                                }
                            });
                        });
                        // connect to localhost:21 as anonymous 
                        ftp.connect({host: url});
                    }
                );

                return res;
            },
            async getBase64ImageString(url, filePath, fileName, serverImageStorePath) {
                check(url, String);
                check(filePath, String);
                check(fileName, String);
                check(serverImageStorePath, String);

                let base64ImageString = fs.readFileSync(serverImageStorePath+fileName, 'base64'); 

                return base64ImageString;
            },
            async analysePicture(baseColorRGB, dominantColor) {
                
                let diffRed   = Math.abs(baseColorRGB[0] - dominantColor[0]);
                let diffGreen = Math.abs(baseColorRGB[1] - dominantColor[1]);
                let diffBlue  = Math.abs(baseColorRGB[2] - dominantColor[2]);

                let pctDiffRed   = diffRed   / 255;
                let pctDiffGreen = diffGreen / 255;
                let pctDiffBlue  = diffBlue  / 255;

                let diffPctage = (pctDiffRed + pctDiffGreen + pctDiffBlue) / 3 * 100;
                let matchPctage = 100 - diffPctage;

                return Number(matchPctage.toFixed(2));
            },
            async isURLAvailable(url) {
                check(url, String);

                let res = new Promise(
                    function(resolve, reject){
                        console.log('CHECKING URL AVAILABILITY');
                        HTTP.get(url, {}, function(error, result) {
                                if(error){
                                    console.log('REJECTED ERROR');
                                    console.log(error);
                                    reject(error);
                                }
                                else{
                                    console.log('RESOLVED RESULT');
                                    resolve(result);
                                    
                                     // This will return the HTTP response object that looks something like this:
                                     // {
                                     //   content: "String of content...",
                                     //   data: Array[100], <-- Our actual data lives here. 
                                     //   headers: {  Object containing HTTP response headers }
                                     //   statusCode: 200
                                     // }
                                    
                                }
                            });
                    }
                );
                //console.log(res);
                console.log('AVAILABILITY CHECKED');
                return res;
            },
            async postToMTC(url, matchPctage, latlng, droneID, img) {
                check(url, String);

                let res = new Promise(
                    function(resolve, reject){
                        console.log('CHECKING URL AVAILABILITY');
                        HTTP.post(url, {
                                    // data: {"match_percentage": 99,
                                    //         "latitude": 18,
                                    //         "longitude": 18,
                                    //         "drone_id": 5,
                                    //         "base64image": "Base64ImageString"
                                    // }
                                    data: {"match_percentage": matchPctage,
                                            "latitude": latlng.lng,
                                            "longitude": latlng.lat,
                                            "drone_id": droneID,
                                            "base64image": img
                                    }
                                }, function(error, result) {
                                if(error){
                                    console.log('REJECTED ERROR');
                                    console.log(error);
                                    reject(error);
                                }
                                else{
                                    console.log('RESOLVED RESULT');
                                    resolve(result);
                                    
                                     // This will return the HTTP response object that looks something like this:
                                     // {
                                     //   content: "String of content...",
                                     //   data: Array[100], <-- Our actual data lives here. 
                                     //   headers: {  Object containing HTTP response headers }
                                     //   statusCode: 200
                                     // }
                                    
                                }
                            });
                    }
                );
                //console.log(res);
                console.log('AVAILABILITY CHECKED');
                return res;
            },
    });
}