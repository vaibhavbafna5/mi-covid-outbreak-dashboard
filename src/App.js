import React, { Component } from 'react';
import logo from './logo.svg';
import MichiganMap from './michigan';
import Autocomplete from './search';
import ZipCodeDataPanel from './zipcode-data';
import Chart from './chart';
import ZipCodeOverviewContainer from "./zipcode-overview-container";
import TopNav from "./nav.js";

import axios from "axios";

// bootstrap components
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Spinner from 'react-bootstrap/Spinner';

import { CovidNegativeBadge, CovidPositiveBadge, AwaitingResultsBadge, CovidLikeBadge } from './badges'

import questionMarkIcon from './icons/questionMarkIcon.svg';

// const CHART_DATA_ENDPOINT = 'http://0.0.0.0:5000/chart-data'
const CHART_DATA_ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/chart-data'

const popover = (
    <Popover style={{ minWidth: "450px", backgroundColor: "white", border: "none", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)", marginTop: "12px", paddingRight: "4px", fontFamily: "Montserrat" }}>
        <Popover.Content>
            <h3 class="semi-bold" style={{ textAlign: "center", marginTop: "8px" }}>Quick Tips</h3>
            <h5 class="regular" style={{ marginLeft: "12px", lineHeight: "24px", marginTop: "16px" }}><span style={{ fontWeight: "500" }}>Disclaimer</span> <span style={{ fontStyle: "italic" }}>- the data surfaced on the dashboard is collected from self-reports made by MiSymptoms users. This is not information reported directly from medical officials.</span></h5>
            <ul style={{ marginTop: "12px", paddingLeft: "12px", listStyle: "none" }}>
                <li><CovidLikeBadge></CovidLikeBadge>   - user has been flagged by our system as symptomatic for COVID-19 based on their <span style={{ marginTop: "16px" }}>self-reported symptoms</span></li>
                <li><CovidPositiveBadge></CovidPositiveBadge>    - user self-reported they tested positive for COVID-19</li>
                <li><CovidNegativeBadge></CovidNegativeBadge>    - user self-reported they tested negative for COVID-19 </li>
                <li><AwaitingResultsBadge></AwaitingResultsBadge>    - user self-reported they’re awaiting results from a COVID-19 test</li>
            </ul>
            <h5 class="regular" style={{ marginLeft: "12px", lineHeight: "24px", marginTop: "-8px" }}>If you have any questions or feedback please contact <span style={{ color: "#0077A7" }}>jzelner@umich.edu</span></h5>
        </Popover.Content>
    </Popover>
);

const Popup = () => (
    <div style={{ textAlign: "left", marginLeft: "70px", paddingTop: "27px" }}>
        <OverlayTrigger placement="bottom" overlay={popover}>
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
            loading: true,
        }

        axios.get(CHART_DATA_ENDPOINT, {
            params: {
                'area': 'statewide',
            }
        }).then((res) => {
            this.setState({
                cumulativeData: res.data['chart_data']['cumulative_data'],
                weeklyData: res.data['chart_data']['weekly_data'],
                loading: false,
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
                weeklyData: res.data['chart_data']['weekly_data'],
                loading: false,
            })
        }).catch((e) => {
            console.log("error", e);
        })
    }

    onZipCodeChange = (newZipCode) => {
        if (newZipCode == "") {
            newZipCode = 'statewide'
        }

        this.setState({
            zipCode: newZipCode,
            loading: true,
        })

        console.log("onZipCode change", this.state.zipCode);

        axios.get(CHART_DATA_ENDPOINT, {
            params: {
                'area': newZipCode,
            }
        })
            // get state level cumulative/weekly data 
            .then(res => {
                this.setState({
                    cumulativeData: res.data['chart_data']['cumulative_data'],
                    weeklyData: res.data['chart_data']['weekly_data'],
                    loading: false,
                })
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
                <TopNav />
                <Popup />
                <Container style={{ marginTop: "30px" }}>
                    <Row>
                        <Col style={{ maxWidth: "524px" }}>
                            <Row style={{ maxHeight: "40px" }}>
                                <Col className="no-gutters" style={{ maxHeight: "40px" }}>
                                    <Autocomplete onZipCodeChange={this.onZipCodeChange} zipCode={this.state.zipCode} />
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
                            <Row>
                                <ZipCodeOverviewContainer zipCode={this.state.zipCode} />
                            </Row>
                            <Row className="justify-content-center">
                                {this.state.loading ?
                                    (<div style={{ paddingTop: "72px" }}>
                                        <Spinner style={{ color: "#008EC6" }} animation="border" />
                                    </div>) :
                                    (<Chart showWeeklyData={this.state.showWeeklyData} weeklyData={this.state.weeklyData} cumulativeData={this.state.cumulativeData} />)
                                }
                            </Row>
                        </Col>
                        <Col style={{ maxWidth: "478px", marginLeft: "50px" }} class="no-gutters">
                            <Row class="no-gutters" style={{ top: "0" }}>
                                <ZipCodeDataPanel zipCode={this.state.zipCode} style={{ minWidth: "550px", top: "0" }} class="no-gutters" />
                            </Row>
                        </Col>
                        {/* <div style={{ marginTop: "24px", }}>
                                <MichiganMap />
                            </div> */}
                    </Row>
                </Container>
            </>
        )
    }
}