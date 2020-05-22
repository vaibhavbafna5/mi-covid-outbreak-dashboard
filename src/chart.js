import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import classes from "./chart.module.css";

// import './index.css';

// const symptomaticColor = ""

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
                    "name": "Covid-Like Reports",
                    "data": newProps.weeklyData["symptomatic_responses"]
                },
                {
                    "name": "Covid-Positive Reports",
                    "data": newProps.weeklyData["covid_positive_cases"],
                }
            ],
            cumulativeData: [
                {
                    "name": "Covid-Like Reports",
                    "data": newProps.cumulativeData["symptomatic_responses"],
                },
                {
                    "name": "Covid-Positive Reports",
                    "data": newProps.cumulativeData["covid_positive_cases"],
                }
            ],
            showWeeklyData: newProps.showWeeklyData,
        })
    }

    render() {
        return (
            <div style={{ marginTop: "45px" }}>
                {this.state.showWeeklyData ?
                    (
                        <LineChart colors={["#8573BC", "#B80000"]} width="524px" height="200px" legend={"bottom"} data={this.state.weeklyData} />
                    ) : (
                        <LineChart colors={["#8573BC","#B80000"]} width="524px" height="200px" legend={"bottom"} data={this.state.cumulativeData} />
                    )
                }
            </div>
        )
    }

}