import React, { Component, PropTypes } from 'react';
import PopupInfoHeader from './PopupInfoHeader.jsx';
import PopupStreetView from './PopupStreetView.jsx';
import PopupZonePictures from './PopupZonePictures.jsx';
import PopupTabMenu from './PopupTabMenu.jsx';


// PossibleZone component - represents a single todo item
export default class PossibleZone extends Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        let feature = this.props.feature;
        return (
                <span>
                  <PopupTabMenu feature={feature} />
                  <div key={'popup_content_'+feature._id} id={'popup_content_'+feature._id} className='popup-content'>
                    <div key={'popup_info_'+feature._id} className="popup-info">
                      <div key={'initial_div_'+feature._id} id={'initial_div_'+feature._id} className="tab">
                        <div className="content">
                           <PopupInfoHeader feature={feature} />
                         </div>
                       </div>
                       <div key={'pictures_zone_'+feature._id} id={'pictures_zone_'+feature._id} className="tab">
                         <div className="content">
                           <PopupInfoHeader feature={feature} />
                           <hr/>
                           <PopupZonePictures feature={feature} />
                         </div>
                       </div>                      
                      <div key={'sviframe_div_'+feature._id} id={'street_view_'+feature._id} className="tab">
                        <div className="content">
                           <PopupInfoHeader feature={feature} />
                           <hr/>
                            <PopupStreetView feature={feature} />
                         </div>
                       </div>
                   </div>
                  </div>
                </span>
        );
    }
}
 
PossibleZone.propTypes = {
  // This component gets the possibleZone to display through a React prop.
  // We can use propTypes to indicate it is required
  //possibleZone: PropTypes.object.isRequired,
  //showPrivateButton: React.PropTypes.bool.isRequired,
};