import React, { Component } from 'react';
import logo from './logo.svg';
import MichiganMap from './michigan';
import Autocomplete from './search';
import Chart from './chart';
import ZipCodeData from './zipcode-data';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zipcode: "",
        }
    }

    componentDidMount() {

    }

    onZipCodeChange = (newZip) => {
        this.setState({ zipcode: newZip })
    }

    render() {
        return (
            <div>
                <h2>Covid Outbreak Dashboard</h2>
                <div style={{}}>
                    <Autocomplete style={{ float: "left", position: "relative", paddingRight: "700px" }} onZipCodeChange={this.onZipCodeChange} />
                    <div style={{ float: "right", width: "700px" }}>
                        <ZipCodeData zipcode={this.state.zipcode} />
                    </div>
                </div>
                <div>
                    <MichiganMap style={{ width: "500px", }} />
                </div>
                <Chart />
                {/* zip code data */}
            </div>
        )
    }
}