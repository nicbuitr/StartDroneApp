import React, { Component } from 'react';

export default class PopupZonePictures extends Component {
    render(){
        let feature = this.props.feature;
        return(
            <div className="tabcontent">
              {this.props.feature.pictures.map((picture, i) => (
                  <div key={'zone_'+feature._id+'_'+i} className="text-center">
                     <p key={'zone_'+feature._id+'_match_pctg_'+i}> Match: {picture.match_percentage}% > {picture.min_match_percentage}%</p>
                     <p key={'zone_'+feature._id+'_drone_id_'+i}> Drone ID: {picture.drone_id}</p>
                     <img key={'zone_'+feature._id+'_picture_'+i} src={picture.base64image} className='inline-img-responsive'/>
                     <hr/>
                  </div>
                ))}
             </div>
        );
    }
}