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
            <div style={{ width: "400px" }}>
                <Card>
                    <Card.Header id="overview-container-header">
                        <Row>
                            <Col>
                                {this.state.zipCode == "" ? (<h2>Statewide</h2>) : (<h2>{this.state.zipCode}</h2>)}
                                <h4 style={{ color: "white", }}><b>{this.state.data['total_responses']} MiSymptoms Users | {this.state.data['date_range']}</b></h4>
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body id="overview-container-body">
                        <Card.Text>
                            <h3>{this.state.data['symptomatic_cases']} COVID-like reports  <b style={{ opacity: "0.25" }}>|</b>  {this.state.data['confirmed_cases']} COVID-positive reports</h3>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer id="overview-container-footer" className="text-muted"><p style={{ fontSize: "12px" }}>Data last updated on {this.state.data['last_updated']}</p></Card.Footer>
                </Card>
            </div>
        )
    }

}