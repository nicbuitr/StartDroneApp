import React, { Component } from 'react';

export default class PopupTabMenu extends Component {
    render(){
        return(
        <div className="tabs">
           <ul className="tabs-link">
              <a href={'#street_view_lot_'+this.props.feature._id}><li className="tab-link left-edge">StreetView</li></a>
              <a href={'#info_lot_'+this.props.feature._id}><li className="tab-link">Info</li></a>
              <a href={'#rates_lot_'+this.props.feature._id}><li className="tab-link">Rates</li></a>
              <a href={'#amenities_lot_'+this.props.feature._id}><li className="tab-link right-edge">Amenities</li></a>
           </ul>
        </div>
        );
    }
}