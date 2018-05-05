
/**TODO
<-- Check Hasta Acá. -->
/

/* global L*/
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ReactDOMServer from 'react-dom/server';
import { ParkingLots } from '../api/startDroneMethods.js';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import ParkingLot from './ParkingLot.jsx';
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
            pythonScriptPath: "C:/Users/NicoBuitrago/Downloads/Web/StartDroneApp/BebopDrone/core/startDroneRoutineA.py",
            ipMTC: "http://192.168.198.128:4000/m2m/applications/DroneSensor1/containers/zoneInfoContainer/contentInstances",
            droneIP: "192.168.42.1",
            ftpFilePath: "/internal_000/Bebop_Drone/media/",
            ftpFileName: "Bebop_Drone_2018-04-20T114925+0000_569EE3.jpg",
            serverImageStorePath: "C:/Users/NicoBuitrago/Downloads/Web/StartDroneApp/BebopDrone/DronePictures/",
            numberOfPicsToTake: 2,
            baseColorRGB: [255, 255, 255]
        };
    }
  
    handleSubmit(event) {
        event.preventDefault();
        this.state.latlng?Meteor.call('parkingLots.insert', this.state.latlng):alert('Latlng nulo.');
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
            //map = L.map('map').setView([4.625826,-74.0923325], 11);
            map = L.map('map').setView([4.6011612,-74.0656423], 18);
            //map = L.map('map').setView([39.74739, -105], 12);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmljYnVpdHIiLCJhIjoiY2oydHJmODRrMDBiYTMzanhxbzk2YnFudiJ9.KRyluyVgDk_ShZOYEuW1Wg', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>, ' +
            'App by &copy; 2017 <a href="https://github.com/nicbuitr/ParkingLotsMap">Nicol&aacute;s Buitrago C</a>',
                id: 'mapbox.streets'
            }).addTo(map);

            L.control.locate({locateOptions: {enableHighAccuracy: true}}).addTo(map);
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
            popupContent = ReactDOMServer.renderToString(<ParkingLot key={'parking_lot_'+feature._id} feature={feature} />);
            layer.bindPopup(popupContent);
            markerList.push(layer);
        }

        L.geoJSON(this.props.parkingLots, {

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
          e.preventDefault();
          if(e.target.name === 'pythonScriptPath'){
              state.pythonScriptPath = e.target.value;
          }
          else if(e.target.name === 'droneIP'){
              state.droneIP = e.target.value;
          }
          else if(e.target.name === 'ftpFilePath'){
              state.ftpFilePath = e.target.value;
          }
          else if(e.target.name === 'ftpFileName'){
              state.ftpFileName = e.target.value;
          }
          else if(e.target.name === 'serverImageStorePath'){
              state.serverImageStorePath = e.target.value;
          }
          else if(e.target.name === 'baseColorRGB'){
              state.baseColorRGB = e.target.value.split(',');
          }
          this.setState(state);
    }

    async startDrone(event) {
        //event.preventDefault();
        this.result = new ReactiveVar();
        this.latestError = new ReactiveVar();
        this.checkFTPConnection = new ReactiveVar();
        this.listFTPDirs = new ReactiveVar();
        this.getPicturesFTP = new ReactiveVar();
        this.getBase64ImageString = new ReactiveVar();
        this.analysePicture = new ReactiveVar();
        this.isURLAvailable = new ReactiveVar();
        this.postToMTC = new ReactiveVar();
        let res = '';
        let rows = '';
        try{

            // Check connection to drone by checking FTP status
            document.getElementById('drone-start-result').innerHTML = ReactDOMServer.renderToString(<div className="panel panel-default"><div id="operation-div" className="operation-in-progress panel-body text-center"><h4><strong><div id="operation-header">Checking connection to drone... </div></strong></h4><img id="loading-gif" src="/img/drone.gif" className="inline-img-responsive" alt="Drone Gif"/></div></div>);
            document.getElementById('drone-pictures').innerHTML = '';
            await sleep(1000);
            $('#drone-start-panel').scrollView();

            // this.checkFTPConnection.set(await Meteor.callPromise('checkFTPConnection', this.state.droneIP));
            res = (this.checkFTPConnection.get() === undefined)?'':this.checkFTPConnection.get();             


            // Execute Python script
            document.getElementById('operation-header').innerHTML = res + '<hr> Executing script, please wait...';
            document.getElementById('loading-gif').src = '/img/drone.gif';
            await sleep(1000);
            $('#drone-start-panel').scrollView();

            this.result.set(await Meteor.callPromise('startDrone', this.state.pythonScriptPath));
            // await sleep(1000);
            res = (this.result.get() === undefined)?'':this.result.get();
            rows = "";
             for (var i = 0; i < res.length; i++) {                    
                rows += '<div class="row"><div class="col-xs-12">'+res[i]+'</div></div>';
            }
            
            // Display Python log and List FTP directories and files
            // document.getElementById('operation-header').innerHTML = 'Python succesfully executed. Listing FTP Directories and Files...';
            document.getElementById('drone-start-result').innerHTML = '<div class="panel panel-default"><div id="operation-div" class="operation-in-progress panel-body text-center"><h4><strong><div id="operation-header">Python succesfully executed. <hr> Listing FTP Directories and Files...</div></strong></h4> <div class="python-results">'+rows+'</div></div></div>';
            await sleep(1000);
            $('#drone-start-panel').scrollView();


            // this.listFTPDirs.set(await Meteor.callPromise('listFTPDirs', this.state.droneIP, this.state.ftpFilePath));
            let listFTPDirs = (this.listFTPDirs.get() === undefined)?[{name: "Bebop_Drone_2018-04-26T151048+0000_FCCB9F.jpg"},{name: "Bebop_Drone_2018-04-26T151053+0000_FCCB9F.jpg"}]:this.listFTPDirs.get();
            document.getElementById('drone-start-result').innerHTML = ReactDOMServer.renderToString(<div className="panel panel-default"><div id="operation-div" className="operation-in-progress panel-body text-center"><h4><strong><div id="operation-header">Transfering pictures, please wait...<hr/></div></strong></h4><img id="loading-gif" src="/img/drone.gif" className="inline-img-responsive" alt="Drone Gif"/></div></div>);
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
                            // document.getElementById('drone-start-result').innerHTML = '<div id=\"drone-start-result\" class=\"drone-start-result\"><div class=\"panel panel-default\"><div class=\"operation-in-progress panel-body text-center\"><h4><strong>Transfering pictures taken, please wait... </strong></h4><div class=\"python-results\">' + rows + '</div></div></div>';
                            $('#drone-start-panel').scrollView();

                            // this.getPicturesFTP.set(await Meteor.callPromise('getPicturesFTP', this.state.droneIP, this.state.ftpFilePath, listFTPDirs[i].name, this.state.serverImageStorePath));
                            res = (this.getPicturesFTP.get() === undefined)?'':this.getPicturesFTP.get();

                            document.getElementById('operation-header').innerHTML = 'Getting Base64 String of the pictures, please wait...<hr> Picture: ' + (i+1) +' of ' + numberOfPicsToTake + '<br>' +  listFTPDirs[i].name;
                            // document.getElementById('drone-start-result').innerHTML = '<div id=\"drone-start-result\" class=\"drone-start-result\"><div class=\"panel panel-default\"><div class=\"operation-in-progress panel-body text-center\"><h4><strong>Transfering pictures taken, please wait... </strong></h4><div class=\"python-results\">' + rows + '</div></div></div>';
                            $('#drone-start-panel').scrollView();
                            
                            // Get base64 string from the transferred image
                            this.getBase64ImageString.set(await Meteor.callPromise('getBase64ImageString', this.state.droneIP, this.state.ftpFilePath, listFTPDirs[i].name, this.state.serverImageStorePath));
                            res = (this.getBase64ImageString.get() === undefined)?'':this.getBase64ImageString.get(); 

                            let img = new Image();
                            img.id = listFTPDirs[i].name;
                            img.src = "data:image/jpg;base64,"+res;
                            img.className = "inline-img-responsive";
                            let dronePicturesElement = document.getElementById('drone-pictures').appendChild(img);
                            await sleep(1000);

                            let dominantColor = colorThief.getColor(img);
                            let colorPalette = colorThief.getPalette(img);
                            let colorPaletteRows = '';

                            // Match Picture Dominant Color to BaseRGB Color
                            this.analysePicture.set(await Meteor.callPromise('analysePicture', this.state.baseColorRGB, dominantColor));
                            let matchPctage = (this.analysePicture.get() === undefined)?'':this.analysePicture.get(); 

                            for (var j = 0; j < colorPalette.length; j++) {
                                colorPaletteRows += '<div class="btn-xs colored-btn" style="background-color: rgb('+colorPalette[j][0]+', '+colorPalette[j][1]+', '+colorPalette[j][2]+');'+'">&nbsp;</div>'
                            }

                            rows += ('<div class="row">'
                                     +'   <div class="col-xs-11">'
                                     +'       <h4><strong>Picture: ' + (i+1) +' of ' + numberOfPicsToTake + '<br>' + matchPctage + '% Match to Base Color' + '<br>' +  listFTPDirs[i].name+'</strong></h4>'
                                     +'       <img id='+img.id+' src='+img.src+' class='+img.className+'>'
                                     +'   </div>'
                                     +'   <div class="col-xs-1">'
                                     +'       <h4><strong>Colors</strong></h4><hr>'
                                     +'       <div class="btn-xs colored-btn" style="background-color: rgb('+dominantColor[0]+', '+dominantColor[1]+', '+dominantColor[2]+');'+'">&nbsp;</div>'
                                     + colorPaletteRows
                                     +'   </div>'
                                     +'</div><hr>');
                            // Analyse pictures taken.
                            // document.getElementById('drone-start-result').innerHTML = '<div id=\"drone-start-result\" class=\"drone-start-result\"><div class=\"panel panel-default\"><div class=\"operation-in-progress panel-body text-center\"><h4><strong>Analyzing pictures, please wait... </strong></h4><img src="/img/drone.gif" class="inline-img-responsive" alt="Drone Gif"/></div></div></div>';
                            // $('#drone-start-panel').scrollView();


                            // CHECK CONNECTION TO MTC
                            // this.isURLAvailable.set(await Meteor.callPromise('isURLAvailable', this.state.ipMTC));
                            res = (this.isURLAvailable.get() === undefined)?'':this.isURLAvailable.get(); 
                            
                            if (res.code != undefined){
                                throw new Error("Couldn't connect to " + this.state.droneIP + " Error: " +res.code);
                            }

                            // POST TO MTC
                            // this.postToMTC.set(await Meteor.callPromise('postToMTC', this.state.ipMTC));
                            res = (this.postToMTC.get() === undefined)?'':this.postToMTC.get();                             
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

    landDrone(event) {

    }

    render() {
        return (
            <div className="container">
              <header id="header" className="collapse in">      
                <AccountsUIWrapper />
                <div className="col-md-12 text-center">
                    <img src="img/logo.png" className="inline-img-responsive" id="img-logo" alt="Start Drone App Logo"/>
                    <hr/>
                    <label className='control-label' htmlFor='comments'>Python Script Path:</label>
                    <input className='form-control' type="text" ref="textInput" id="pythonScriptPath"  name="pythonScriptPath" placeholder="Type script path" value={this.state.pythonScriptPath} onChange={this.handleInputChange.bind(this)}/>
                    <input className='form-control' type="text" ref="textInput" id="droneIP"  name="droneIP" placeholder="Type drone IP" value={this.state.droneIP} onChange={this.handleInputChange.bind(this)}/>
                    <input className='form-control' type="text" ref="textInput" id="ftpFilePath"  name="ftpFilePath" placeholder="Type FTP FilePath" value={this.state.ftpFilePath} onChange={this.handleInputChange.bind(this)}/>
                    <input className='form-control' type="text" ref="textInput" id="ftpFileName"  name="ftpFileName" placeholder="Type FTP ftpFileName" value={this.state.ftpFileName} onChange={this.handleInputChange.bind(this)}/>
                    <input className='form-control' type="text" ref="textInput" id="serverImageStorePath"  name="serverImageStorePath" placeholder="Type FTP serverImageStorePath" value={this.state.serverImageStorePath} onChange={this.handleInputChange.bind(this)}/>
                    <input className='form-control' type="text" ref="textInput" id="baseColorRGB"  name="baseColorRGB" placeholder="Type baseColorRGB" value={this.state.baseColorRGB} onChange={this.handleInputChange.bind(this)} style={{backgroundColor: "rgb(" + this.state.baseColorRGB + ")"}}/>
                    <button aria-label="Start Drone" title="Start Drone" type="button" className="glyphicon glyphicon-plane btn-primary btn-lg" onClick={this.startDrone.bind(this)}>
                        <span></span>
                    </button>
                    &nbsp;
                    <button aria-label="Land Drone" title="Land Drone" type="button" className="glyphicon glyphicon-chevron-down btn-primary btn-lg" onClick={this.landDrone.bind(this)}>
                        <span></span>
                    </button>
                    <div id="drone-start-panel" className="drone-start-panel"></div>
                    <hr/>
                    <div id="drone-start-result" className="drone-start-result"></div>
                    <div id="drone-pictures" className="drone-pictures"></div>
                </div>
                { this.props.currentUser && this.props.currentUser._id == 'yCAY4Ae2ykQqJqqxj' ?
                  <div className="col-md-12 text-center">
                      <button aria-label="Add current location button" type="button" className="btn-primary btn-lg" onClick={this.handleSubmit.bind(this)}>Add Current Location</button>
                  </div> : ''
                }            
                {/**TODO Generar de forma dinámica los checkbox para filtrar */}  
                <div className="row" style={{visibility: 'hidden'}}>
                <label className="hide-completed">
                  <input type="checkbox" readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)}
                  />
                  Hide Completed ParkingLots
                </label>
                </div>

              </header>
              <div id="progress"><div id="progress-bar"></div></div>
              <div id="map-div" className="collapse in">
                    <div id="map"></div>
              </div>
                <button aria-label="Toggle show or hide header" type="button" className="banner-chevron btn-primary btn-lg leaflet-control" data-toggle="collapse" data-target="#map-div">
                    <span></span>
                </button>
              {this.state.map?this.componentDidMount():''}
            </div>
        );
    }
}

App.propTypes = {
    parkingLots: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
};
 
export default createContainer(() => {
    Meteor.subscribe('parkingLots');
    return {
        parkingLots: ParkingLots.find().fetch(),
        currentUser: Meteor.user(),
    };
}, App);