import React, { Component } from 'react';
import logo from './logo.svg';
import MichiganMap from './michigan';
import Autocomplete from './search';
import ZipCodeData from './zipcode-data';
import Chart from './chart';
import axios from "axios";

const ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/state-data'

export default class App extends Component {


    constructor(props) {
        super(props);
        var resultData = {}
        this.state = {
            zipcode: "",
            lastUpdated: "",
            // resultData is core data panel (line chart + addresses + top line metrics)
            cumulativeData: [],
            weeklyData: [],
        }
    }

    componentDidMount() {
        axios.get(ENDPOINT)
            .then(res => {
                this.setState({
                    cumulativeData: res.data['chart_data']['cumulative_data'],
                    weeklyData: res.data['chart_data']['weekly_data']
                })
                console.log("yo,", this.state)
            })
    }

    onZipCodeChange = (newZip) => {
        this.setState({ zipcode: newZip })
    }

    render() {
        return (
            <div>
                <h2>Covid Outbreak Dashboard</h2>
                <Autocomplete onZipCodeChange={this.onZipCodeChange} />
                <ZipCodeData zipcode={this.state.zipcode} />
                <MichiganMap />
                <Chart weeklyData={this.state.weeklyData} cumulativeData={this.state.cumulativeData} />
            </div>
        )
    }
}