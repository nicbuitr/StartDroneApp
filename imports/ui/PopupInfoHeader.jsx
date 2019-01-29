import React, { Component } from 'react';

export default class PopupInfoHeader extends Component {
    render() {
        let feature = this.props.feature;
        return (
            <div>
                <h4><strong>Latitude: {feature.geometry.coordinates[1]}</strong></h4>
                <h4><strong>Longitude: {feature.geometry.coordinates[0]}</strong></h4>
                <p> Possible Illegal Mining Zone Information</p>
            </div>
        );
    }
}