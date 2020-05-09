import React, { Component } from 'react';
import logo from './logo.svg';
import MichiganMap from './michigan';
import Autocomplete from './search';
import ZipCodeDataPanel from './zipcode-data';
import Chart from './chart';
import axios from "axios";

const CHART_DATA_ENDPOINT = 'http://0.0.0.0:5000/chart-data'
// const ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/state-data'

export default class App extends Component {


    constructor(props) {
        super(props);
        var resultData = {}
        this.state = {
            zipCode: "",
            lastUpdated: "",
            // resultData is core data panel (line chart + addresses + top line metrics)
            cumulativeData: [],
            weeklyData: [],
        }
    }

    componentDidMount() {
        axios.get(CHART_DATA_ENDPOINT, {
            params: {
                'area': 'statewide',
            }
        })
            // get state level cumulative/weekly data 
            .then(res => {
                this.setState({
                    cumulativeData: res.data['chart_data']['cumulative_data'],
                    weeklyData: res.data['chart_data']['weekly_data']
                })
                console.log("yo,", this.state)
            })
    }

    onZipCodeChange = (newZipCode) => {
        if (newZipCode == "") {
            newZipCode = 'statewide'
        }

        this.setState({ zipCode: newZipCode })
        axios.get(CHART_DATA_ENDPOINT, {
            params: {
                'area': newZipCode,
            }
        })
            // get state level cumulative/weekly data 
            .then(res => {
                this.setState({
                    cumulativeData: res.data['chart_data']['cumulative_data'],
                    weeklyData: res.data['chart_data']['weekly_data']
                })
                console.log("merp", this.state)
            })
        // make an api request to get zipcode level data
        // reset cumulative/weekly data
        // pass zipcode to zipcodedatapanel to thing to render
    }

    render() {
        return (
            <div>
                <h2>Covid Outbreak Dashboard</h2>
                <Autocomplete onZipCodeChange={this.onZipCodeChange} />
                <MichiganMap />
                <Chart weeklyData={this.state.weeklyData} cumulativeData={this.state.cumulativeData} />
                <ZipCodeDataPanel zipCode={this.state.zipCode} />
            </div>
        )
    }
}