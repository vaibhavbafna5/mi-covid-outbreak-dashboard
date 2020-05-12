import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './index.css';

export default class Chart extends Component {


    constructor(props) {
        super(props);
        this.state = {
            zipCode: "",
            data: [
                {
                    "name": "Covid Positive Cases",
                    "data": props.weeklyData["covid_positive_cases"],
                },
                {
                    "name": "Symptomatic Responses",
                    "data": props.weeklyData["symptomatic_responses"],
                }
            ],
            weeklyData: [
                {
                    "name": "Covid Positive Cases",
                    "data": props.weeklyData["covid_positive_cases"],
                },
                {
                    "name": "Symptomatic Responses",
                    "data": props.weeklyData["symptomatic_responses"],
                }
            ],
            cumulativeData: [
                {
                    "name": "Covid Positive Cases",
                    "data": props.cumulativeData["covid_positive_cases"],
                },
                {
                    "name": "Symptomatic Responses",
                    "data": props.cumulativeData["symptomatic_responses"],
                }
            ],
            showWeeklyData: true,
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(newProps) {
        this.setState({
            weeklyData: [
                {
                    "name": "Covid Positive Cases",
                    "data": newProps.weeklyData["covid_positive_cases"],
                },
                {
                    "name": "Symptomatic Responses",
                    "data": newProps.weeklyData["symptomatic_responses"],
                }
            ],
            cumulativeData: [
                {
                    "name": "Covid Positive Cases",
                    "data": newProps.cumulativeData["covid_positive_cases"],
                },
                {
                    "name": "Symptomatic Responses",
                    "data": newProps.cumulativeData["symptomatic_responses"],
                }
            ],
            showWeeklyData: newProps.showWeeklyData,
        })
    }

    render() {
        return (
            <div >
                {this.state.showWeeklyData ?
                    (
                        <LineChart legend={"bottom"} width="420px" height="150px" data={this.state.weeklyData} />
                    ) : (
                        <LineChart legend={"bottom"} width="420px" height="150px" data={this.state.cumulativeData} />
                    )
                }
            </div>
        )
    }

}