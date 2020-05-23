import React, { Component } from "react";
import Badge from 'react-bootstrap/Badge';

class CovidNegativeBadge extends Component {
    render() {
        return (
            <Badge style={{ backgroundColor: "#E8F3EE", color: "#158655", height:"23px", width:"112px", textAlign:"center" }}>
                <div style={{marginTop:"3px"}}><h8>COVID-Negative</h8></div>
            </Badge>
        );
    };
}

class AwaitingResultsBadge extends Component {
    render() {
        return (
            <Badge style={{ backgroundColor: "#FFF7E3", color: "#8A6300", height:"23px", width:"115px", textAlign:"center"}}>
                <div style={{marginTop:"3px"}}><h8>Awaiting Results</h8></div>
            </Badge>
        );
    };
}

class CovidPositiveBadge extends Component {
    render() {
        return (
            <Badge style={{ backgroundColor: "#F8E5E5", color: "#B80000", height:"23px", width:"105px", textAlign:"center"}}>
                <div style={{marginTop:"3px"}}><h8>COVID-Positive</h8></div>
            </Badge>
        );
    };
}

class CovidLikeBadge extends Component {
    render() {
        return (
            <Badge style={{ backgroundColor: "#F3F1F8", color: "#8573BC", height:"23px", width:"82px", textAlign:"center"}}>
                <div style={{marginTop:"3px"}}><h8>COVID-Like</h8></div>
            </Badge>
        )
    }
}


export { CovidNegativeBadge, CovidPositiveBadge, AwaitingResultsBadge, CovidLikeBadge };