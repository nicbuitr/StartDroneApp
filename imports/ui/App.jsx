
/**TODO
<-- Check Hasta Acá. -->
/

/* global L*/
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ReactDOMServer from 'react-dom/server';
import { PossibleZones } from '../api/startDroneMethods.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import PossibleZone from './PossibleZone.jsx';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
 
const sleep = (mS) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, mS);
  });
}

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
 
        this.state = {
            hideCompleted: false,
            map: null,
            layer: null,
            latlng: null,
            filters: [],
            locateCtrl: null,
            pythonScriptPath: "C:/Users/NicoBuitrago/Downloads/Web/StartDroneApp/BebopDrone/core/",
            droneIP: "192.168.42.1",
            droneID: 1,
            ftpFilePath: "/internal_000/Bebop_Drone/media/",
            serverImageStorePath: "C:/Users/NicoBuitrago/Downloads/Web/StartDroneApp/BebopDrone/DronePictures/",
            numberOfPicsToTake: 2,
            baseColorRGB: [255, 255, 255],
            ipMTC: "http://192.168.198.128:4000/m2m/applications/DroneSensor/containers/zoneInfoContainer/contentInstances",
            awaitTime: 3000,
            droneON: false,
            MTC_ON: false
        };
    }
  
    handleSubmit(event) {
        event.preventDefault();
        this.state.latlng?Meteor.call('possibleZones.insert', this.state.latlng):alert('Latlng nulo.');
    }
  
    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    componentDidMount() {
        document.documentElement.lang = 'en';

        let map = this.state.map;

        if (!this.state.map){
            map = L.map('map').setView([4.625826,-74.0923325], 11);
            // map = L.map('map').setView([4.6011612,-74.0656423], 18);
            //map = L.map('map').setView([39.74739, -105], 12);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmljYnVpdHIiLCJhIjoiY2oydHJmODRrMDBiYTMzanhxbzk2YnFudiJ9.KRyluyVgDk_ShZOYEuW1Wg', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>, ' +
            'App by &copy; 2017 <a href="https://github.com/nicbuitr/StartDroneApp">Nicol&aacute;s Buitrago C</a>',
                id: 'mapbox.streets'
            }).addTo(map);

            this.state.locateCtrl = L.control.locate({locateOptions: {enableHighAccuracy: true}}).addTo(map);
            map.on('locationfound',
            (e) => {
                this.state.latlng = e.latlng;
            });

            map.addControl( new L.Control.Search({
                url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
                jsonpParam: 'json_callback',
                propertyName: 'display_name',
                propertyLoc: ['lat','lon'],
                marker: L.circleMarker([0,0],{radius:30}),
                autoCollapse: true,
                autoType: false,
                zoom: 18,
                minLength: 2
            }) );
        }
        if (this.state.layer){
            if (map.hasLayer(this.state.layer)) {
                map.removeLayer(this.state.layer);
            }
        }

  
        var progress = document.getElementById('progress');
        var progressBar = document.getElementById('progress-bar');

        function updateProgressBar(processed, total, elapsed) {
            if (elapsed > 1000) {
                // if it takes more than a second to load, display the progress bar:
                progress.style.display = 'block';
                progressBar.style.width = Math.round(processed/total*100) + '%';
            }

            if (processed === total) {
                // all markers processed - hide the progress bar:
                progress.style.display = 'none';
            }
        }

        var markers = L.markerClusterGroup({ chunkedLoading: true, chunkProgress: updateProgressBar });
        var markerList = [];

        function onEachFeature(feature, layer) {
            var popupContent = '';

            if (feature.properties && feature.properties.popupContent) {
                popupContent += feature.properties.popupContent;
            }
            popupContent = ReactDOMServer.renderToString(<PossibleZone key={'possible_zone_'+feature._id} feature={feature} />);
            layer.bindPopup(popupContent);
            markerList.push(layer);
        }

        L.geoJSON(this.props.possibleZones, {

            filter: function (feature, layer) {
                if (feature.properties) {
                    // If the property "underConstruction" exists and is true, return false (don't render features under construction)
                    return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
                }
                return false;
            },
            onEachFeature: onEachFeature,

            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { title: feature.properties.name });
            }
        });


        markers.addLayers(markerList);
        map.addLayer(markers);
        this.state.layer = markers;
        this.state.map = map;
    }

    handleInputChange(e){
        var state = this.state;
        if (e.target.type === 'checkbox'){
            if(e.target.name === 'droneON'){
              state.droneON = e.target.checked;
            }
            else if(e.target.name === 'MTC_ON'){
              state.MTC_ON = e.target.checked;
            }
        }
        else {
            e.preventDefault();
            if(e.target.name === 'pythonScriptPath'){
              state.pythonScriptPath = e.target.value;
            }
            else if(e.target.name === 'droneIP'){
              state.droneIP = e.target.value;
            }
            else if(e.target.name === 'droneID'){
              state.droneID = e.target.value;
            }
            else if(e.target.name === 'ftpFilePath'){
              state.ftpFilePath = e.target.value;
            }
            else if(e.target.name === 'serverImageStorePath'){
              state.serverImageStorePath = e.target.value;
            }
            else if(e.target.name === 'numberOfPicsToTake'){
              state.numberOfPicsToTake = e.target.value;
            }
            else if(e.target.name === 'baseColorRGB'){
              state.baseColorRGB = e.target.value.split(',');
            }
            else if(e.target.name === 'ipMTC'){
              state.ipMTC = e.target.value;
            }
            else if(e.target.name === 'awaitTime'){
              state.awaitTime = e.target.value;
            }
        }
        this.setState(state);
    }

    async startDrone(event) {
        try{
            //event.preventDefault();
            let inputs = document.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                 let empty = false;
                 if (inputs[i].id != 'searchtext9'){
                    if (inputs[i].type === 'text'){
                        if (inputs[i].value === ''){
                            empty = true;
                        }
                    }
                    else if (inputs[i].type === 'number'){
                        if (inputs[i].value === '' || inputs[i].value <= 0){
                            empty = true;
                        }
                    }
                    if (empty){
                        inputs[i].style = 'background-color: rgb(255, 235, 235); border-color: red';
                        inputs[i].focus();
                        alert("Please enter the required valid information");
                        return;
                    }
                    else {
                        if (inputs[i].id === 'baseColorRGB'){
                            inputs[i].style = 'border-color: #ccc';
                        }
                        else{
                            inputs[i].style = 'background-color: white; border-color: #ccc';   
                        }
                    }
                 }
            } 
            this.result = new ReactiveVar();
            this.latestError = new ReactiveVar();
            this.checkFTPConnection = new ReactiveVar();
            this.listFTPDirs = new ReactiveVar();
            this.getPicturesFTP = new ReactiveVar();
            this.getBase64ImageString = new ReactiveVar();
            this.analysePicture = new ReactiveVar();
            this.isURLAvailable = new ReactiveVar();
            this.postToMTC = new ReactiveVar();
            let droneON = this.state.droneON;
            let MTC_ON = this.state.MTC_ON;
            let awaitTime = this.state.awaitTime;
            let res = '';
            let rows = '';



            // Get current location
            let tries = 5;
            document.getElementById('drone-start-result').innerHTML = '<div class="panel panel-default"><div id="operation-div" class="operation-in-progress panel-body text-center"><h4><strong><div id="operation-header">Attempting to get current location. <hr></div></strong></h4></div></div>';
            $('#drone-start-panel').scrollView();
            this.state.locateCtrl.start();

            while (!this.state.latlng && tries > 0){
                await sleep(1000);
                document.getElementById('operation-header').innerHTML = 'Attempting to get current location <hr>' + tries + ' seconds left.'
                tries--;
            }

            !this.state.latlng?this.state.latlng = {lat: 4.6011612, lng:-74.0656423}:"";

            // Check connection to drone by checking FTP status
            document.getElementById('drone-start-result').innerHTML = ReactDOMServer.renderToString(<div className="panel panel-default"><div id="operation-div" className="operation-in-progress panel-body text-center"><h4><strong><div id="operation-header">Checking connection to drone... </div></strong></h4><img id="loading-gif" src="/img/ToDroneSerial.gif" className="inline-img-responsive" alt="Drone Gif"/></div></div>);
            document.getElementById('drone-pictures').innerHTML = '';
            document.getElementById('python-results').innerHTML = '';
            document.getElementById('python-results').classList.remove('python-results');
            $('#drone-start-panel').scrollView();
            

            droneON?this.checkFTPConnection.set(await Meteor.callPromise('checkFTPConnection', this.state.droneIP)):'';
            res = (this.checkFTPConnection.get() === undefined)?'Connection to Drone FTP Successful':this.checkFTPConnection.get();
            await sleep(awaitTime);             

            // Execute Python script
            document.getElementById('operation-header').innerHTML = res + '<hr> Executing script, please wait...';
            document.getElementById('loading-gif').src = '/img/drone.gif';
            $('#drone-start-panel').scrollView();

            droneON?this.result.set(await Meteor.callPromise('startDrone', this.state.pythonScriptPath, this.state.numberOfPicsToTake)):'';
            res = (this.result.get() === undefined)?["Starting Drone", "Take Off Successfull", "Taking Picture 1", "Rotating 180 degrees", "Taking Picture 2", "Rotating 180 degrees", "Pictures Taken", "Landed Successfully", "Python Executed"]:this.result.get();
            await sleep(awaitTime); 
            rows = "";
             for (var i = 0; i < res.length; i++) {                    
                rows += '<div class="python-line">> '+res[i]+'</div>';
            }
            
            // Display Python log and List FTP directories and files
            document.getElementById('operation-header').innerHTML = 'Python succesfully executed. Listing FTP Directories and Files...';
            document.getElementById('loading-gif').src = '/img/ToDroneSerial.gif';
            if (rows.length > 0){
                document.getElementById('python-results').classList.add('python-results');
                document.getElementById('python-results').innerHTML = rows;
            }
            $('#drone-start-panel').scrollView();


            droneON?this.listFTPDirs.set(await Meteor.callPromise('listFTPDirs', this.state.droneIP, this.state.ftpFilePath)):'';
            // let listFTPDirs = (this.listFTPDirs.get() === undefined)?[{name: "Bebop_Drone_2018-04-26T151048+0000_FCCB9F.jpg"},{name: "Bebop_Drone_2018-04-26T151053+0000_FCCB9F.jpg"}]:this.listFTPDirs.get();
            let listFTPDirs = (this.listFTPDirs.get() === undefined)?[{name: "1.jpg"},{name: "2.jpg"}, {name: "3.jpg"}, {name: "4.jpg"}]:this.listFTPDirs.get();
            await sleep(awaitTime); 

            rows = "";
            if (listFTPDirs.length > 0){
                listFTPDirs.reverse();
                let numberOfPicsToTake = this.state.numberOfPicsToTake;
                let colorThief = new ColorThief.colorRob();                
                for (var i = 0; i < numberOfPicsToTake; i++) {
                    if (listFTPDirs[i].name != undefined){
                        if (listFTPDirs[i].name.toLowerCase().includes(".jpg") || listFTPDirs[i].name.toLowerCase().includes(".jpeg") || listFTPDirs[i].name.toLowerCase().includes(".png")){
                            
                            // Transfer pictures taken.
                            document.getElementById('operation-header').innerHTML = 'Transfering pictures, please wait...<hr> Picture: ' + (i+1) +' of ' + numberOfPicsToTake + '<br>' +  listFTPDirs[i].name;
                            $('#drone-start-panel').scrollView();

                            droneON?this.getPicturesFTP.set(await Meteor.callPromise('getPicturesFTP', this.state.droneIP, this.state.ftpFilePath, listFTPDirs[i].name, this.state.serverImageStorePath)):'';
                            res = (this.getPicturesFTP.get() === undefined)?'':this.getPicturesFTP.get();
                            await sleep(awaitTime); 

                            document.getElementById('operation-header').innerHTML = 'Getting Base64 String of the pictures, please wait...<hr> Picture: ' + (i+1) +' of ' + numberOfPicsToTake + '<br>' +  listFTPDirs[i].name;
                            document.getElementById('loading-gif').src = '/img/ToServer.gif';
                            $('#drone-start-panel').scrollView();
                            
                            // Get base64 string from the transferred image
                            this.getBase64ImageString.set(await Meteor.callPromise('getBase64ImageString', this.state.droneIP, this.state.ftpFilePath, listFTPDirs[i].name, this.state.serverImageStorePath));
                            res = (this.getBase64ImageString.get() === undefined)?'':this.getBase64ImageString.get();
                            await sleep(awaitTime); 

                            // Analyse pictures taken.
                            document.getElementById('operation-header').innerHTML =  'Analyzing pictures, please wait...<hr> Picture: ' + (i+1) +' of ' + numberOfPicsToTake + '<br>' +  listFTPDirs[i].name;
                            $('#drone-start-panel').scrollView();

                            let img = new Image();
                            img.id = listFTPDirs[i].name;
                            img.src = "data:image/jpg;base64,"+res;
                            img.className = "inline-img-responsive";
                            document.getElementById('drone-pictures').innerHTML = '';
                            document.getElementById('drone-pictures').appendChild(img);
                            await sleep(1000);

                            let dominantColor = colorThief.getColor(img);
                            let colorPalette = colorThief.getPalette(img);
                            let colorPaletteRows = '';

                            // Match Picture Dominant Color to BaseRGB Color
                            this.analysePicture.set(await Meteor.callPromise('analysePicture', this.state.baseColorRGB, dominantColor));
                            let matchPctage = (this.analysePicture.get() === undefined)?'':this.analysePicture.get();
                            await sleep(awaitTime); 

                            for (var j = 0; j < colorPalette.length; j++) {
                                colorPaletteRows += '<div class="btn-xs colored-btn" style="background-color: rgb('+colorPalette[j][0]+', '+colorPalette[j][1]+', '+colorPalette[j][2]+');'+'">&nbsp;</div>'
                            }

                            rows += ('<div class="row">'
                                     +'   <div class="col-xs-11">'
                                     +'       <h4><strong>Picture: ' + (i+1) +' of ' + numberOfPicsToTake + '<br>' + matchPctage + '% Match to Base Color'+ '<br> [Lat, Lng]: [' + this.state.latlng.lat +", " +this.state.latlng.lng + ']<br>' +  listFTPDirs[i].name+'</strong></h4>'
                                     +'       <img id='+img.id+' src='+img.src+' class='+img.className+'>'
                                     +'   </div>'
                                     +'   <div class="col-xs-1">'
                                     +'       <h4><strong>Colors</strong></h4><hr>'
                                     +'       <div class="btn-xs colored-btn" style="background-color: rgb('+dominantColor[0]+', '+dominantColor[1]+', '+dominantColor[2]+');'+'">&nbsp;</div>'
                                     + colorPaletteRows
                                     +'   </div>'
                                     +'</div><hr>');
                            

                            // Checking connection to MTC.
                            document.getElementById('operation-header').innerHTML = 'Checking connection to MTC, please wait...<hr> Picture: ' + (i+1) +' of ' + numberOfPicsToTake + '<br>' +  listFTPDirs[i].name;
                            document.getElementById('loading-gif').src = '/img/ToMTCSerial.gif';                            
                            $('#drone-start-panel').scrollView();

                            // CHECK CONNECTION TO MTC
                            MTC_ON?this.isURLAvailable.set(await Meteor.callPromise('isURLAvailable', this.state.ipMTC)):'';
                            res = (this.isURLAvailable.get() === undefined)?'':this.isURLAvailable.get();
                            await sleep(awaitTime);
                            
                            if (res.code != undefined){
                                throw new Error("Couldn't connect to " + this.state.ipMTC + " Error: " +res.code);
                            }
                            
                            // Posting to MTC.
                            document.getElementById('operation-header').innerHTML = 'Posting report to MTC, please wait...<hr> Report: ' + (i+1) +' of ' + numberOfPicsToTake + '<br> Match: ' +  matchPctage + '% <br> [Lat, Lng]: [' + this.state.latlng.lat +", " +this.state.latlng.lng + ']<br> Drone ID: ' + this.state.droneID;
                            $('#drone-start-panel').scrollView();

                            // POST TO MTC
                            MTC_ON?this.postToMTC.set(await Meteor.callPromise('postToMTC', this.state.ipMTC, matchPctage, this.state.latlng, this.state.droneID, img.src)):'';
                            res = (this.postToMTC.get() === undefined)?'':this.postToMTC.get();
                            await sleep(awaitTime);                            
                        }
                    }
                }
                document.getElementById('drone-pictures').innerHTML = rows;
            }


            // // EXECUTION FINISHED
            document.getElementById('drone-start-result').innerHTML = '<div class="panel panel-default"><div class="operation-success panel-body text-center"><h4><strong>EXECUTION FINISHED.</strong></h4></div></div>';
            $('#drone-start-panel').scrollView();

        } 
        catch (e){
            this.latestError.set(e.message);
            document.getElementById('drone-start-result').innerHTML = '<div id=\"drone-start-result\" class=\"drone-start-result\"><div class=\"panel panel-default\"><div class=\"operation-failed panel-body text-center\"><h4><strong> Something went wrong <hr/>' + e.message + '</strong></h4></div></div></div>';
        }
    }

    async landDrone(event) {
        try{
            this.result = new ReactiveVar();
            this.latestError = new ReactiveVar();
            let droneON = this.state.droneON;
            let awaitTime = this.state.awaitTime;
            let res = '';
            let rows = '';

            // Check connection to drone by checking FTP status
            document.getElementById('drone-start-result').innerHTML = ReactDOMServer.renderToString(<div className="panel panel-default"><div id="operation-div" className="operation-in-progress panel-body text-center"><h4><strong><div id="operation-header">Executing script, please wait...</div></strong></h4><img id="loading-gif" src="/img/ToDroneSerial.gif" className="inline-img-responsive" alt="Drone Gif"/></div></div>);
            document.getElementById('drone-pictures').innerHTML = '';
            document.getElementById('python-results').innerHTML = '';
            document.getElementById('python-results').classList.remove('python-results');
            $('#drone-start-panel').scrollView();

            // Execute Python script
            droneON?this.result.set(await Meteor.callPromise('landDrone', this.state.pythonScriptPath)):'';
            res = (this.result.get() === undefined)?["Landing Drone", "Landing Off Successfull"]:this.result.get();
            await sleep(awaitTime); 
            
            rows = "";
             for (var i = 0; i < res.length; i++) {                    
                rows += '<div class="python-line">> '+res[i]+'</div>';
            }
            
            // Display Python log and List FTP directories and files
            document.getElementById('operation-header').innerHTML = 'Python succesfully executed. Listing FTP Directories and Files...';
            document.getElementById('loading-gif').src = '/img/ToDroneSerial.gif';
            if (rows.length > 0){
                document.getElementById('python-results').classList.add('python-results');
                document.getElementById('python-results').innerHTML = rows;
            }
            $('#drone-start-panel').scrollView();

            // // EXECUTION FINISHED
            document.getElementById('drone-start-result').innerHTML = '<div class="panel panel-default"><div class="operation-success panel-body text-center"><h4><strong>EXECUTION FINISHED.</strong></h4></div></div>';
            $('#drone-start-panel').scrollView();            
        } 
        catch (e){
            this.latestError.set(e.message);
            document.getElementById('drone-start-result').innerHTML = '<div id=\"drone-start-result\" class=\"drone-start-result\"><div class=\"panel panel-default\"><div class=\"operation-failed panel-body text-center\"><h4><strong> Something went wrong <hr/>' + e.message + '</strong></h4></div></div></div>';
        }
    }

    render() {
        return (
            <div className="container">
              <header id="header" className="collapse in">      
                <AccountsUIWrapper />
                <div className="col-md-12 text-center">
                    <img src="img/logo.png" className="inline-img-responsive" id="img-logo" alt="Start Drone App Logo"/>
                    { this.props.currentUser && this.props.currentUser.username === 'admin' ?
                        <div id="drone-menu">
                            <div className="row text-left collapse in" id="parameters">
                                <hr/>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='droneIP'>Drone IP Address</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="text" ref="textInput" id="droneIP"  name="droneIP" placeholder="Type drone IP" value={this.state.droneIP} onChange={this.handleInputChange.bind(this)} title="Drone IP Address"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='droneID'>Drone ID</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="number" ref="textInput" id="droneID"  name="droneID" placeholder="Type drone ID" value={this.state.droneID} onChange={this.handleInputChange.bind(this)} title="Drone ID"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='pythonScriptPath'>Python Script Path</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="text" ref="textInput" id="pythonScriptPath"  name="pythonScriptPath" placeholder="Type script path" value={this.state.pythonScriptPath} onChange={this.handleInputChange.bind(this)} title="Path of the Python Script that performs the drone routine"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='ftpFilePath'>Drone FTP Path</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="text" ref="textInput" id="ftpFilePath"  name="ftpFilePath" placeholder="Type FTP FilePath" value={this.state.ftpFilePath} onChange={this.handleInputChange.bind(this)} title="Path to the drone folder that contains the pictures taken"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='serverImageStorePath'>Server Storage Path</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="text" ref="textInput" id="serverImageStorePath"  name="serverImageStorePath" placeholder="Type FTP serverImageStorePath" value={this.state.serverImageStorePath} onChange={this.handleInputChange.bind(this)} title="Path to the server folder that will store the pictures transferred from the drone"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='numberOfPicsToTake'>Pictures to Take</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="number" ref="textInput" id="numberOfPicsToTake"  name="numberOfPicsToTake" placeholder="Type number of pictures to take" value={this.state.numberOfPicsToTake} onChange={this.handleInputChange.bind(this)} title="Amount of pictures to be taken by the drone"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='baseColorRGB'>Base Color RGB</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="text" ref="textInput" id="baseColorRGB"  name="baseColorRGB" placeholder="Type baseColorRGB" value={this.state.baseColorRGB} onChange={this.handleInputChange.bind(this)} style={{backgroundColor: "rgb(" + this.state.baseColorRGB + ")"}} title="Base Color that will be compared to the dominant color of the pictures taken"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='ipMTC'>MTC Container URL</label>
                                </div>
                                <div className="col-md-10">
                                    <input className='form-control' type="text" ref="textInput" id="ipMTC"  name="ipMTC" placeholder="Type the MTC Container URL" value={this.state.ipMTC} onChange={this.handleInputChange.bind(this)} title="URL of the MTC container to send the information for processing, report and notification"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='awaitTime'>Await Time(mS)</label>
                                </div>
                                <div className="col-md-4">
                                    <input className='form-control' type="number" ref="textInput" id="awaitTime"  name="awaitTime" placeholder="Type await time" value={this.state.awaitTime} onChange={this.handleInputChange.bind(this)} title="Await time between operations"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='droneON'>Drone Connected to Server?</label>
                                </div>
                                <div className="col-md-1">
                                    <input className='form-control' type="checkbox" ref="textInput" id="droneON"  name="droneON" value={this.state.droneON} onChange={this.handleInputChange.bind(this)} title="Check this if the drone is connected to server"/>
                                </div>
                                <div className="col-md-2">
                                    <label className='control-label text-left' htmlFor='MTC_ON'>MTC & Scripts Running?</label>
                                </div>
                                <div className="col-md-1">
                                    <input className='form-control' type="checkbox" ref="textInput" id="MTC_ON"  name="MTC_ON" value={this.state.MTC_ON} onChange={this.handleInputChange.bind(this)} title="Check this if the MTC and the Python Script are running"/>
                                </div>
                            </div>
                            <hr/>
                            <button aria-label="Toggle show or hide parameters" type="button" className="banner-chevron btn-primary btn-lg" data-toggle="collapse" data-target="#parameters" title="Hide/Show Parameters">
                                <span></span>
                            </button>
                            <hr/>
                            <button aria-label="Start Drone" title="Start Drone" type="button" className="glyphicon glyphicon-plane btn-primary btn-lg" onClick={this.startDrone.bind(this)}>
                                <span></span>
                            </button>
                            &nbsp;
                            <button aria-label="Land Drone" title="Land Drone" type="button" className="glyphicon glyphicon-arrow-down btn-primary btn-lg" onClick={this.landDrone.bind(this)}>
                                <span></span>
                            </button>
                        </div>: <h4><strong><div className="col-md-12" id="not-logged-in"><hr/>Login as admin to enable drone deploying options.<hr/></div></strong></h4>
                    }  
                    <div id="drone-start-panel" className="drone-start-panel"></div>
                    <hr/>
                    <div id="drone-start-result" className="drone-start-result"></div>
                    <div id="drone-pictures" className="drone-pictures"></div>
                    <div id="python-results"></div>
                </div>           
                {/**TODO Generar de forma dinámica los checkbox para filtrar */}  
                <div className="row" style={{visibility: 'hidden'}}>
                <label className="hide-completed">
                  <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)}
                  />
                  Hide Completed PossibleZones
                </label>
                </div>

              </header>
              <div id="progress"><div id="progress-bar"></div></div>
              <div id="map-div" className="collapse in">
                    <div id="map"></div>
              </div>
                <button aria-label="Toggle show or hide header" type="button" className="banner-chevron btn-primary btn-lg" data-toggle="collapse" data-target="#map-div">
                    <span></span>
                </button>
              {this.state.map?this.componentDidMount():''}
            </div>
        );
    }
}

App.propTypes = {
    possibleZones: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
};
 
export default createContainer(() => {
    Meteor.subscribe('possibleZones');
    return {
        possibleZones: PossibleZones.find().fetch(),
        currentUser: Meteor.user(),
    };
}, App);