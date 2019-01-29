import React, { Component } from 'react';

export default class PopupStreetView extends Component {
    render() {
        return (
            <div className="popup-iframe">
                <iframe key={'sviframe_' + this.props.feature._id} width="275" height="200" frameBorder="0" style={{ border: 0 }}
                    src={'https://www.google.com/maps/embed/v1/streetview?key=AIzaSyB2z6ukJIFTaOKN_cIsPKtDCQB_EkMQBuU&location=' + this.props.feature.geometry.coordinates[1] + ', ' + this.props.feature.geometry.coordinates[0] + '&heading=' + (this.props.feature.geometry.heading ? this.props.feature.geometry.heading : 0) + '&pitch=' + (this.props.feature.geometry.pitch ? this.props.feature.geometry.pitch : 0) + '&fov=' + (this.props.feature.geometry.fov ? this.props.feature.geometry.fov : 100)}
                    allowFullScreen=""></iframe>
            </div>
        );
    }
}