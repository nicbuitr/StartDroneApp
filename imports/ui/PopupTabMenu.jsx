import React, { Component } from 'react';

export default class PopupTabMenu extends Component {
    render(){
        return(
        <div className="tabs">
           <ul className="tabs-link">
              <a href={'#pictures_zone_'+this.props.feature._id}><li className="tab-link left-edge">Pictures</li></a>
              <a href={'#street_view_'+this.props.feature._id}><li className="tab-link right-edge">StreetView</li></a>
           </ul>
        </div>
        );
    }
}