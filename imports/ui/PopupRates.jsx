import React, { Component } from 'react';

export default class PopupRates extends Component {
    render(){
        return(
            <div className="tabcontent">
             <p> Car Minute Rate: <strong>${this.props.featureProps.carRates.minute.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Car Hour Rate: <strong>${this.props.featureProps.carRates.hour.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Car Day Rate: <strong>${this.props.featureProps.carRates.day.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Car Month Rate: <strong>${this.props.featureProps.carRates.month.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <hr/>
             <p> Motorcycle Minute Rate: <strong>${this.props.featureProps.motorcycleRates.minute.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Motorcycle Hour Rate: <strong>${this.props.featureProps.motorcycleRates.hour.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Motorcycle Day Rate: <strong>${this.props.featureProps.motorcycleRates.day.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Motorcycle Month Rate: <strong>${this.props.featureProps.motorcycleRates.month.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <hr/>
             <p> Bicycle Minute Rate: <strong>${this.props.featureProps.bicycleRates.minute.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Bicycle Hour Rate: <strong>${this.props.featureProps.bicycleRates.hour.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Bicycle Day Rate: <strong>${this.props.featureProps.bicycleRates.day.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             <p> Bicycle Month Rate: <strong>${this.props.featureProps.bicycleRates.month.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</strong></p>
             </div>
        );
    }
}