import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from "axios";

const REPORT_DATA_ENDPOINT = 'http://0.0.0.0:5000/report-data'

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
                        <h2>Yeah, we've got data for {this.state.data['zipcode']}</h2>
                        <h3>{this.state.data['total_responses']} total reports</h3>
                        <h3>{this.state.data['symptomatic_cases']} COVID-like cases</h3>
                        <h6>{this.state.data['confirmed_cases']} COVID-positive cases</h6>
                        <h6>Last updated - {this.state.data['last_updated']} </h6>
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
                            <h2>Check the state data (but also plz enter a zipcode)</h2>
                            <p>Hint - "48104" works well :-) </p>
                            <h3>{this.state.data['total_responses']} total responses</h3>
                            <h3>{this.state.data['symptomatic_cases']} COVID-like cases</h3>
                            <h6>{this.state.data['confirmed_cases']} COVID-positive cases</h6>
                            <h6>Last updated - {this.state.data['last_updated']} </h6>
                        </div>
                    )}
            </div>
        )
    }

}