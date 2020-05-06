import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default class ZipCodeData extends Component {

    constructor(props) {
        super(props);
        console.log("zip", this.props.zipcode)

        var zipData = {}
        var zipDataExists = true

        if (this.props.zipcode == "") {
            zipData = {}
            zipDataExists = false
        } else {
            zipDataExists = true
            zipData = {
                "zipcode": 48104,
                "symptomatic_cases": 1517,
                "confirmed_cases": 169,
                "case_data": [
                    {
                        "address": "923 South State Street, Ann Arbor, MI 48104",
                        "num_cases": 2,
                        "cases": [
                            {
                                "phone_number": "864-202-3343",
                                "symptoms": "runny nose, sneezing, coughing",
                            },
                            {
                                "phone_number": "864-346-2663",
                                "symptoms": "runny nose, sneezing, coughing",
                            },

                        ]
                    }
                ]
            }
        }

        this.state = {
            zipcode: this.props.zipcode,
            // this would be swapped with an API request
            data: zipData
        }

        console.log("data", this.state.data)
    }

    componentDidMount() {

    }

    render() {

        if (this.props.zipcode == "") {
            this.state.zipcodeDataExists = false
            this.state.data = {}
        } else {
            this.state.zipcodeDataExists = true
            this.state.data = {
                "zipcode": 48104,
                "symptomatic_cases": 1517,
                "confirmed_cases": 169,
                "case_data": [
                    {
                        "address": "923 South State Street, Ann Arbor, MI 48104",
                        "num_cases": 2,
                        "cases": [
                            {
                                "phone_number": "864-202-3343",
                                "symptoms": "runny nose, sneezing, coughing",
                            },
                            {
                                "phone_number": "864-346-2663",
                                "symptoms": "runny nose, sneezing, coughing",
                            },

                        ]
                    },
                    {
                        "address": "715 Granger Avenue, Ann Arbor, MI 48104",
                        "num_cases": 1,
                        "cases": [
                            {
                                "phone_number": "864-202-3343",
                                "symptoms": "runny nose, sneezing, coughing",
                            },
                        ]
                    }
                ]
            }
        }

        return (
            <div>
                {this.state.zipcodeDataExists ?
                    (<div>
                        <h2>Yeah, we've got data</h2>
                        <h2>{this.state.data['zipcode']}</h2>
                        <h3>{this.state.data['symptomatic_cases']} symptomatic cases</h3>
                        <h6>{this.state.data['confirmed_cases']} confirmed cases</h6>
                        <Accordion>
                            {this.state.data['case_data'].map((item, index) => (
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey={index}>{item['address']}</Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={index}>
                                        <Card.Body>
                                            {item['cases'].map((case_datum, ind) => (
                                                <div>
                                                    <p>{case_datum['phone_number']}</p>
                                                    <p>{case_datum['symptoms']}</p>
                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            ))}
                        </Accordion>
                    </div>) :
                    (<h2>Please enter a zipcode</h2>)}
            </div>
        )
    }

}