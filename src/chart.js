import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'
import React, { Component } from 'react';

export default class Chart extends Component {


    constructor(props) {
        super(props);
        this.state = {
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
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            data: [
                {
                    "name": "Covid Positive Cases",
                    "data": newProps.weeklyData["covid_positive_cases"],
                },
                {
                    "name": "Symptomatic Responses",
                    "data": newProps.weeklyData["symptomatic_responses"],
                }
            ],
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
        })
    }

    setData(event) {
        var newData = []
        if (event.target.value == 'weekly') {
            newData = this.state.weeklyData
        } else {
            newData = this.state.cumulativeData;
        }
        this.setState({
            data: newData,
        })
        console.log("plz", this.state.data)
    }

    render() {
        return (
            <div>
                <div onChange={this.setData.bind(this)}>
                    <input type="radio" value="cumulative" name="gender" /> Show cumulative cases
                    <input type="radio" value="weekly" name="gender" defaultChecked /> Show weekly cases
                </div>
                <LineChart data={this.state.data} />
            </div>
        )
    }

}