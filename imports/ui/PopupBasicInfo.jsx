import React, { Component } from 'react';

export default class PopupBasicInfo extends Component {
    render(){
        return(
            <div className="tabcontent">
               <p> Operation Days: {this.props.featureProps.operationDays}</p>
               <p> Operation Hours: {this.props.featureProps.operationHours}</p>
               <p> Cars Admited: {this.props.featureProps.cars?'Yes':'No'}</p>
               <p> Motorcycles Admited: {this.props.featureProps.motorcycles?'Yes':'No'}</p>
               <p> Bicycles Admited: {this.props.featureProps.bicycles?'Yes':'No'}</p>
             </div>
        );
    }
}