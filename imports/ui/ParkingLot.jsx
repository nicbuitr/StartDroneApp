import React, { Component, PropTypes } from 'react';
import PopupInfoHeader from './PopupInfoHeader.jsx';
import PopupStreetView from './PopupStreetView.jsx';
import PopupBasicInfo from './PopupBasicInfo.jsx';
import PopupRates from './PopupRates.jsx';
import PopupAmenities from './PopupAmenities.jsx';
import PopupTabMenu from './PopupTabMenu.jsx';


// ParkingLot component - represents a single todo item
export default class ParkingLot extends Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        let feature = this.props.feature;
        let featureProps = feature.properties;
        let ret;
        if (feature.properties && feature.properties.name) {
            ret = (
                    <div key={'popup_info_'+feature._id} className="popup-info">
                      <div key={'initial_div_'+feature._id} id={'initial_div_'+feature._id} className="tab">
                        <div className="content">
                           <PopupInfoHeader featureProps={featureProps} />
                         </div>
                       </div>
                      <div key={'sviframe_div_'+feature._id} id={'street_view_lot_'+feature._id} className="tab">
                        <div className="content">
                           <PopupInfoHeader featureProps={featureProps} />
                           <hr/>
                            <PopupStreetView feature={feature} />
                         </div>
                       </div>
                       <div key={'info_lot_'+feature._id} id={'info_lot_'+feature._id} className="tab">
                         <div className="content">
                           <PopupInfoHeader featureProps={featureProps} />
                           <hr/>
                           <PopupBasicInfo featureProps={featureProps} />
                         </div>
                       </div>
                       <div key={'rates_lot_'+feature._id} id={'rates_lot_'+feature._id} className="tab">
                         <div className="content">
                           <PopupInfoHeader featureProps={featureProps} />
                           <hr/>
                           <PopupRates featureProps={featureProps} />
                          </div>
                       </div>
                       <div key={'amenities_lot_'+feature._id} id={'amenities_lot_'+feature._id} className="tab">
                         <div className="content">
                           <PopupInfoHeader featureProps={featureProps} />
                           <hr/>
                           <PopupAmenities feature={feature} />
                           </div>
                       </div>
                   </div>
        );}
        else{
            ret = (
                   <div key={'popup_info_'+feature._id} className="popup-info">
                      <div key={'sviframe_div_'+feature._id} id={'street_view_lot_'+feature._id} className="tab">
                        <div className="content">
                           <PopupInfoHeader featureProps={featureProps} />
                           <hr/>
                           <PopupStreetView feature={feature} />
                         </div>
                       </div>
                   </div>
        );}
        return (
                <span>
                  <PopupTabMenu feature={feature} />
                  <div key={'popup_content_'+feature._id} id={'popup_content_'+feature._id} className='popup-content'>
                    {ret}
                  </div>
                </span>
        );
    }
}
 
ParkingLot.propTypes = {
  // This component gets the parkingLot to display through a React prop.
  // We can use propTypes to indicate it is required
  //parkingLot: PropTypes.object.isRequired,
  //showPrivateButton: React.PropTypes.bool.isRequired,
};