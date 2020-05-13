import React, { Component } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button';
import axios from "axios";
import './index.css';

// const REPORT_DATA_ENDPOINT = 'http://0.0.0.0:5000/report-data'
const REPORT_DATA_ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/report-data'

export default class ZipCodeDataPanel extends Component {

    constructor(props) {
        super(props);
        console.log("zipcode-data props", this.props)



        this.state = {
            zipCodeDataExists: false,
            zipCode: "",
            data: {},
            caseData: {},
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
                console.log("zipcode data here", response.data)
                this.setState({
                    zipCodeDataExists: true,
                    zipCode: newZipCode,
                    data: response.data,
                    caseData: response.data['home_data'],
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
                    caseData: {},
                })
            }).catch((e) => {
                console.log("error", e);
            });
        }
    }

    onSelectAddress = (selectedAddress) => {
        var caseData = this.state.data['home_data']
        if (selectedAddress == "#work") {
            caseData = this.state.data['work_data']
        }

        this.setState({
            caseData: caseData,
        })
    }

    render() {

        return (
            <div>
                {this.state.zipCodeDataExists ?
                    (<div>
                        <Card bg={'Info'}>
                            <Card.Header >
                                <Row>
                                    <Col>
                                        <h2 className="dottedBox" id="bigHeader">{this.state.data['zipcode']}</h2>
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
                        <Card style={{ marginTop: "36px" }}>
                            <Card.Header>
                                <h4>{this.state.data['home_data'].length + this.state.data['work_data'].length} Addresses</h4>
                                <Nav variant="tabs" defaultActiveKey="#home" onSelect={this.onSelectAddress}>
                                    <Nav.Item>
                                        <Nav.Link href="#home">Home ({this.state.data['home_data'].length})</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link href="#work">Work ({this.state.data['work_data'].length})</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Accordion>
                                {this.state.caseData.map((item, index) => (
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={index}>
                                            <Row >
                                                <Col md="auto" >
                                                    {item['address']}
                                                </Col>
                                                <Col >
                                                    {item['num_reports']} reports
                                                </Col>
                                            </Row>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={index}>
                                            <Card.Body>
                                                {item['cases'].map((case_datum, ind) => (
                                                    <Accordion>
                                                        <Card>
                                                            <Accordion.Toggle as={Card.Header} eventKey={ind}>
                                                                <Row>
                                                                    <Col md="auto">
                                                                        {case_datum['name']} - {case_datum['age']}, {case_datum['gender']}
                                                                    </Col>
                                                                    <Col >
                                                                        {case_datum['phone_number']}
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        {case_datum['flags']['tested'] === 'Negative' ? (
                                                                            <Badge pill variant="success">
                                                                                Covid-Negative
                                                                            </Badge>
                                                                        ) : case_datum['flags']['tested'] === 'Awaiting Results' ? (
                                                                            <Badge pill variant="warning">
                                                                                Awaiting Results
                                                                            </Badge>
                                                                        ) : (
                                                                                    <Badge pill variant="danger">
                                                                                        Covid-Positive
                                                                                    </Badge>
                                                                                )}
                                                                        {
                                                                            case_datum['flags']['symptomatic'] ? (
                                                                                <Badge style={{ marginLeft: "4px" }} pill variant="warning">
                                                                                    Symptomatic
                                                                                </Badge>
                                                                            ) :
                                                                                (<></>)
                                                                        }
                                                                    </Col>
                                                                </Row>
                                                            </Accordion.Toggle>
                                                            <Accordion.Collapse eventKey={ind}>
                                                                <Card.Body>
                                                                    <ul>
                                                                        <li><b>Temperature</b> - {case_datum['temperature']}</li>
                                                                        <li><b>Symptoms</b> - {case_datum['symptoms']}</li>
                                                                        <li><b>Covid+ Contact</b> - {case_datum['covid_contacted']}</li>
                                                                        {
                                                                            case_datum['work_address'] == "" ? (
                                                                                // <p>No work address reported</p>
                                                                                <></>
                                                                            ) : (
                                                                                    <li><b>Work address</b> - {case_datum['work_address']}</li>
                                                                                )
                                                                        }
                                                                        {
                                                                            case_datum['household_sick'] ? (
                                                                                <li><b>Household Sick</b> - members in house are feeling unwell</li>
                                                                            ) :
                                                                                (<li><b>Household Sick</b> - member in house feel fine</li>)
                                                                        }
                                                                        {
                                                                            case_datum['flags']['symptomatic'] ? (
                                                                                <li><b>Symptomatic</b> - yes, COVID-like illness reported</li>
                                                                            ) :
                                                                                (<li><b>Symptomatic</b> - no symptoms of a COVID-like illness reported</li>)
                                                                        }
                                                                        <li><b>Tested</b> - {case_datum['flags']['tested']}</li>
                                                                    </ul>
                                                                </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    </Accordion>
                                                ))}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                ))}
                            </Accordion>
                        </Card>

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