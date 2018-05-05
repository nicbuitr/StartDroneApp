import React, { Component } from 'react';

export default class PopupAmenities extends Component {
    render(){
        return(
            <div className="tabcontent">
              {this.props.feature.properties.amenities.map((amenity) => (
                  <div key={'amenities_lot_'+this.props.feature._id+'_'+amenity} className="amenity-row">
                    <div className="left">
                      {amenity}
                    </div>
                    <div className="right">
                        <span className="glyphicon glyphicon-ok green"></span>
                    </div>
                    <div className="clear"></div>
                  </div>
                ))}
              <hr/>
              {this.props.feature.properties.amenities.map((amenity) => (
                  <div key={'amenities_lot_'+this.props.feature._id+'_2_'+amenity} className="amenity-row">
                    <div className="left">
                      {amenity}
                    </div>
                    <div className="right">
                        <span className="glyphicon glyphicon-ok green"></span>
                    </div>
                    <div className="clear"></div>
                  </div>
                ))}
             </div>
        );
    }
}