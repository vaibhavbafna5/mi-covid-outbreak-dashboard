import React, { Component } from "react";
import Badge from 'react-bootstrap/Badge';

class CovidNegativeBadge extends Component {
    render() {
        return (
            <Badge style={{ backgroundColor: "#E8F3EE", color: "#158655", }} >
                Covid-Negative
            </Badge>
        );
    };
}

class AwaitingResultsBadge extends Component {
    render() {
        return (
            <Badge style={{ backgroundColor: "#FFF7E3", color: "#8A6300", }} >
                Awaiting Results
            </Badge>
        );
    };
}

class CovidPositiveBadge extends Component {
    render() {
        return (
            <Badge style={{ backgroundColor: "#F8E5E5", color: "#8A6300" }} >
                Covid-Positive
            </Badge>
        );
    };
}

class SymptomaticBadge extends Component {
    render() {
        return (
            <Badge style={{ marginLeft: "4px", backgroundColor: "#F3F1F8", color: "#8573BC" }}>
                Symptomatic
            </Badge>
        )
    }
}


export { CovidNegativeBadge, CovidPositiveBadge, AwaitingResultsBadge, SymptomaticBadge };