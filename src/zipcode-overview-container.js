import React, { Component } from 'react';
import axios from "axios";

// CSS file
import './zipcode-overview-container.css'

// bootstrap components
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const REPORT_DATA_ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/report-data'

export default class ZipCodeOverviewContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            zipCode: "",
            data: {},
        }
    }

    componentWillMount() {
        axios.get(REPORT_DATA_ENDPOINT, {
            params: {
                'area': 'statewide',
                'filter_type': 'all',
            }
        })
            // get state level report data 
            .then(res => {
                this.setState({
                    data: res.data,
                })
                console.log("merp", this.state)
            })
    }

    componentWillReceiveProps(newProps) {
        // get zip code level data
        var newZipCode = newProps.zipCode
        if (newZipCode != "" && newZipCode != 'statewide') {
            axios.get(REPORT_DATA_ENDPOINT, {
                params: {
                    'area': newZipCode,
                    'filter_type': 'all',
                }
            }).then((response) => {
                this.setState({
                    zipCode: newZipCode,
                    data: response.data,
                })
            }).catch((e) => {
                console.log("error", e);
            });
        } else {
            axios.get(REPORT_DATA_ENDPOINT, {
                params: {
                    'area': 'statewide',
                    'filter_type': 'all',
                }
            }).then((response) => {
                this.setState({
                    zipCode: "",
                    data: response.data,
                })
            }).catch((e) => {
                console.log("error", e);
            });
        }
    }

    render() {
        return (
            <div style={{ minWidth: "524px", marginTop: "30px", zIndex: "-1" }}>
                <Card id="overview-container">
                    <Card.Header id="overview-container-header">
                        <Row>
                            <Col className="no-gutters">
                                <div>
                                    <div style={{display:"inline-block", marginLeft:"10px"}}>{this.state.zipCode == "" ? (<h1>Statewide</h1>) : (<h1>{this.state.zipCode}</h1>)}</div>
                                    {/* <div style={{ paddingLeft:"12px", display:"inline-block",}}><h4>{this.state.data['total_responses']} Users<span style={{marginLeft:"8px", marginRight:"8px"}}><div className="overview-header-divider"></div></span>{this.state.data['date_range']}</h4></div> */}
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body id="overview-container-body" className="no-gutters">
                        <Card.Text style={{ marginLeft: "14px" }}>
                            <h3 style={{ marginTop: "13px"}}>{this.state.data['symptomatic_cases']} COVID-Like reports<span style={{ marginLeft: "8px", marginRight: "8px" }}><div className="overview-summary-divider"></div></span>{this.state.data['confirmed_cases']} COVID-Positive reports</h3>
                            <h5 class="medium" style={{ color: "#51646D", marginTop: "-1px"}}>{this.state.data['date_range']}<span style={{marginLeft:"8px", marginRight:"8px"}}><div className="overview-dates-divider"></div></span>Data last updated on {this.state.data['last_updated']}</h5>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }

}