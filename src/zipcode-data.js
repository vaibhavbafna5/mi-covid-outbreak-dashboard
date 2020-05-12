import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from "axios";

// const REPORT_DATA_ENDPOINT = 'http://0.0.0.0:5000/report-data'
const REPORT_DATA_ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/report-data'

export default class ZipCodeDataPanel extends Component {

    constructor(props) {
        super(props);
        console.log("zipcode-data props", this.props)



        this.state = {
            zipCodeDataExists: false,
            zipCode: "",
            data: {}
        }
    }

    componentWillMount() {
        //
        axios.get(REPORT_DATA_ENDPOINT, {
            params: {
                'area': 'statewide',
            }
        })
            // get state level report data 
            .then(res => {
                this.setState({
                    data: res.data
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
                console.log("zipcode data here", response.data)
                this.setState({
                    zipCodeDataExists: true,
                    zipCode: newZipCode,
                    data: response.data,
                })
            }).catch((e) => {
                console.log("error", e);
            });
        } else {
            console.log('hey, we got the state change')
            axios.get(REPORT_DATA_ENDPOINT, {
                params: {
                    'area': 'statewide',
                }
            }).then((response) => {
                this.setState({
                    zipCodeDataExists: false,
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
            <div>
                {this.state.zipCodeDataExists ?
                    (<div>
                        <Card>
                            <Card.Header bg={"Primary"}>
                                <Row>
                                    <Col>
                                        <h2>{this.state.data['zipcode']}</h2>
                                        <h6>{this.state.data['total_responses']} MiSymptoms Users | Mar 6 - May 9</h6>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body style={{ paddingBottom: "-8px", }}>
                                <Card.Text>
                                    {this.state.data['symptomatic_cases']} COVID-like reports  <b style={{ opacity: "0.25" }}>|</b>  {this.state.data['confirmed_cases']} COVID-positive reports
                                    </Card.Text>
                            </Card.Body>
                            <Card.Footer style={{ height: "44px" }} className="text-muted"><p style={{ fontSize: "12px" }}>Data last updated on {this.state.data['last_updated']}</p></Card.Footer>
                        </Card>
                        <Accordion>
                            {this.state.data['case_data'].map((item, index) => (
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey={index}>{item['address']} -------> {item['num_reports']} reports</Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={index}>
                                        <Card.Body>
                                            {item['cases'].map((case_datum, ind) => (
                                                <div>
                                                    <div>
                                                        <p>Name - {case_datum['name']}</p>
                                                        <p>Gender - {case_datum['gender']}</p>
                                                        <p>Age - {case_datum['age']}</p>
                                                        <p>Temp - {case_datum['temperature']}</p>
                                                        <p>Phone numba - {case_datum['phone_number']}</p>
                                                        <p>Symptoms - {case_datum['symptoms']}</p>
                                                        {
                                                            case_datum['work_address'] == "" ? (
                                                                <p>No work address reported</p>
                                                            ) : (
                                                                    <p>Work address - {case_datum['work_address']}</p>
                                                                )
                                                        }
                                                        {
                                                            case_datum['household_sick'] ? (
                                                                <p>Household Sick - members in house are sick </p>
                                                            ) :
                                                                (<p>Household Sick - nah fam</p>)
                                                        }
                                                        {
                                                            case_datum['flags']['symptomatic'] ? (
                                                                <p>Symptomatic - yes, COVID-like illness reported</p>
                                                            ) :
                                                                (<p>No symptoms of a COVID-like illness</p>)
                                                        }
                                                        <p>Tested - {case_datum['flags']['tested']}</p>
                                                    </div>
                                                    <hr></hr>
                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            ))}
                        </Accordion>
                    </div>) :
                    (
                        <div>
                            <Card>
                                <Card.Header bg={"Primary"}>
                                    <Row>
                                        <Col>
                                            <h2>Statewide</h2>
                                            <h6>{this.state.data['total_responses']} MiSymptoms Users | Mar 6 - May 9</h6>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body style={{ paddingBottom: "-8px", }}>
                                    <Card.Text>
                                        {this.state.data['symptomatic_cases']} COVID-like reports  <b style={{ opacity: "0.25" }}>|</b>  {this.state.data['confirmed_cases']} COVID-positive reports
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer style={{ height: "44px" }} className="text-muted"><p style={{ fontSize: "12px" }}>Data last updated on {this.state.data['last_updated']}</p></Card.Footer>
                            </Card>
                        </div>
                    )}
            </div>
        )
    }

}