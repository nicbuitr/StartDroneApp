import React, { Component } from 'react';

export default class PopupInfoHeader extends Component {
    render(){
        return(
            <div>
               <h4><strong>{this.props.featureProps.name}</strong></h4>
               <p> Operator: {this.props.featureProps.operator}</p>
               <p> Address: {this.props.featureProps.address}</p>
            </div>
        );
    }
}