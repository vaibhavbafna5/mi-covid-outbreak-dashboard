import React, { Component } from 'react';
import logo from './logo.svg';
import MichiganMap from './michigan';
import Autocomplete from './search';
import ZipCodeDataPanel from './zipcode-data';
import Chart from './chart';
import axios from "axios";

// bootstrap components
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import questionMarkIcon from './icons/questionMarkIcon.svg';

// const CHART_DATA_ENDPOINT = 'http://0.0.0.0:5000/chart-data'
const CHART_DATA_ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/chart-data'

const popover = (
    <Popover id="popover-basic">
        <Popover.Title as="h3">Merp merp</Popover.Title>
        <Popover.Content>
            FAQ - Definitions, explanation, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            consectetur adipiscing elit cola furesd
      </Popover.Content>
    </Popover>
);

const Popup = () => (
    <div style={{ textAlign: "left", marginLeft: "8px", width: "50px", paddingTop: "20px" }}>
        <OverlayTrigger style={{ marginLeft: "8px", paddingTop: "16px", }} placement="bottom" overlay={popover}>
            <img src={questionMarkIcon}></img>
        </OverlayTrigger>
    </div>
);

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
            showWeeklyData: true,
        }

        axios.get(CHART_DATA_ENDPOINT, {
            params: {
                'area': 'statewide',
            }
        }).then((res) => {
            this.setState({
                cumulativeData: res.data['chart_data']['cumulative_data'],
                weeklyData: res.data['chart_data']['weekly_data']
            })
        }).catch((e) => {
            console.log("error", e);
        })
    }

    componentWillMount() {
        axios.get(CHART_DATA_ENDPOINT, {
            params: {
                'area': 'statewide',
            }
        }).then((res) => {
            this.setState({
                cumulativeData: res.data['chart_data']['cumulative_data'],
                weeklyData: res.data['chart_data']['weekly_data']
            })
        }).catch((e) => {
            console.log("error", e);
        })
    }

    onZipCodeChange = (newZipCode) => {
        if (newZipCode == "") {
            newZipCode = 'statewide'
        }

        axios.get(CHART_DATA_ENDPOINT, {
            params: {
                'area': newZipCode,
            }
        })
            // get state level cumulative/weekly data 
            .then(res => {
                this.setState({
                    zipCode: newZipCode,
                    cumulativeData: res.data['chart_data']['cumulative_data'],
                    weeklyData: res.data['chart_data']['weekly_data']
                })
                console.log("merp this fuckin error", this.state)
            })
        // make an api request to get zipcode level data
        // reset cumulative/weekly data
        // pass zipcode to zipcodedatapanel to thing to render
    }

    setData(event) {
        var showWeeklyData = true
        if (event.target.value == 'weekly') {
            showWeeklyData = true;
        } else {
            showWeeklyData = false;
        }
        this.setState({
            showWeeklyData: showWeeklyData,
        })
    }

    render() {
        return (
            <>
                {/* <Navbar bg="primary" variant="dark" expand="lg" >
                    <Navbar.Brand>Covid-19 Outbreak Tracker</Navbar.Brand>
                    <Navbar.Text>
                        Collecting and surfacing responses from MiSymptoms
                    </Navbar.Text>
                </Navbar> */}
                <Navbar id="top-level-nav">
                    <Popup />
                    <div style={{ textAlign: "center", marginTop: "-48px" }}>
                        <h2 className="header">Covid-19 Outbreak Tracker</h2>
                        <h5 className="subheader">Collecting and surfacing responses from MiSymptoms</h5>
                    </div>
                </Navbar>
                <Container style={{ marginTop: "30px" }}>
                    <Row>
                        <Col>
                            <Row style={{ maxHeight: "40px" }}>
                                <Col className="no-gutters" style={{ maxHeight: "40px" }}>
                                    <Autocomplete onZipCodeChange={this.onZipCodeChange} />
                                </Col>
                                <Col className="no-gutters" style={{ maxHeight: "40px" }}>
                                    <Form onChange={this.setData.bind(this)} className="no-gutters" style={{ maxHeight: "40px" }}>
                                        <Row className="no-gutters" style={{ maxHeight: "40px" }}>
                                            <Col>
                                                <label className="date-range-selector" style={{ maxHeight: "40px" }}>
                                                    <input id="cumulative" type="radio" value="cumulative" label="Cumulative" checked={!this.state.showWeeklyData}></input>
                                                    <span className="checkmark"></span>
                                                    <span className="radio-button-label">Cumulative</span>
                                                </label>
                                            </Col>
                                            <Col style={{ maxHeight: "40px" }}>
                                                <label className="date-range-selector" style={{ maxHeight: "40px" }}>
                                                    <input id="weekly" type="radio" value="weekly" label="Past 7 Days" checked={this.state.showWeeklyData}></input>
                                                    <span className="checkmark"></span>
                                                    <span className="radio-button-label">Past 7 Days</span>
                                                </label>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                            <Chart showWeeklyData={this.state.showWeeklyData} weeklyData={this.state.weeklyData} cumulativeData={this.state.cumulativeData} />
                            {/* <div style={{ marginTop: "24px", }}>
                                <MichiganMap />
                            </div> */}
                        </Col>
                        <Col>
                            <ZipCodeDataPanel zipCode={this.state.zipCode} />
                        </Col>
                    </Row>
                </Container>
                {/* <Autocomplete onZipCodeChange={this.onZipCodeChange} />
                <Chart weeklyData={this.state.weeklyData} cumulativeData={this.state.cumulativeData} />
                <MichiganMap />
                <ZipCodeDataPanel zipCode={this.state.zipCode} /> */}
            </>
        )
    }
}