import React, { Component } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { CovidNegativeBadge, CovidPositiveBadge, AwaitingResultsBadge, CovidLikeBadge } from './badges'

import axios from "axios";
import './index.css';
import './zipcode-data.css'
import UnselectedArrow from "./icons/arrow/big/condensed/unselected.svg"
import SelectedArrow from "./icons/arrow/big/expanded/address/selected.svg"

import ItemNotSelectedArrow from "./icons/arrow/big/condensed/unselected.svg"
import ItemNotSelectedButHoveredArrow from "./icons/arrow/big/condensed/hovered.svg"

import AddressSelectedArrow from "./icons/arrow/big/expanded/address/selected.svg"
import ReportSelectedArrow from "./icons/arrow/big/expanded/report/selected.svg"

import ItemSelectedAndHoveredArrow from "./icons/arrow/big/expanded/hovered.svg"

import FilterIconUnhovered from "./icons/filterIconUnhovered.svg";
import FilterIconHovered from "./icons/filterIconHovered.svg";

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
            caseType: "home",
            addressRow: {
                expanded: false,
                backgroundColor: "#FFFFFF",
                imgSrc: UnselectedArrow,
            },
            active: null,
            reportActive: null,
            addressHoverPosition: null,
            reportHoverPosition: null,
            activeReports: {},
            filter: "Filter",
            filterHover: false,
        }
    }

    componentWillMount() {
        //
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
                    zipCodeDataExists: true,
                    zipCode: newZipCode,
                    data: response.data,
                    caseData: response.data['home_data'],
                    caseType: "home",
                })
            }).catch((e) => {
                console.log("error", e);
            });
        } else {
            console.log('hey, we got the state change')
            axios.get(REPORT_DATA_ENDPOINT, {
                params: {
                    'area': 'statewide',
                    'filter_type': 'all',
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
        var caseType = "home"
        if (selectedAddress == "#work") {
            caseData = this.state.data['work_data']
            caseType = "work"
        }

        this.setState({
            caseData: caseData,
            caseType: caseType,
        })
    }

    onAddressToggle(position) {
        console.log("accordion clicked - ", position);
        if (this.state.active === position) {
            this.setState({ active: null })
        } else {
            this.setState({ active: position })
        }
    }

    onAddressHover(position) {
        this.setState({
            addressHoverPosition: position,
        })
    }

    onAddressUnhover(position) {
        this.setState({
            addressHoverPosition: null,
        })
    }

    onReportToggle(position) {
        if (this.state.activeReports[position] == false) {
            this.state.activeReports[position] = true
        } else {
            this.state.activeReports[position] = false
        }
    }

    onReportHover(position) {
        this.setState({
            reportHoverPosition: position,
        })
    }

    onReportUnhover(position) {
        this.setState({
            reportHoverPosition: null,
        })
    }

    setReportArrow(position) {

        /* 
    if this.state.activeReports[pos] == false && this.state.reportHoverPosition == null
    --> ItemNotSelectedArrow

    if this.state.activeReports[pos] == false && this.state.reportHoverPosition == pos
    --> ItemNotSelectedButHovered

    if this.state.activeReports[pos] == true && this.state.reportHoverPosition == null
    --> ReportSelectedArrow

    if this.state.activeReports[pos] == true && this.state.reportHoverPosition == pos
    --> ItemSelectedAndHovered
*/

        if (this.state.activeReports[position] == false && this.state.reportHoverPosition == null) {
            return ItemNotSelectedArrow
        } else if (this.state.activeReports[position] == false && this.state.reportHoverPosition == position) {
            return ItemNotSelectedButHoveredArrow
        } else if (this.state.activeReports[position] == true && this.state.reportHoverPosition == null) {
            return ReportSelectedArrow
        } else if (this.state.activeReports[position] == true && this.state.reportHoverPosition == position) {
            return ItemSelectedAndHoveredArrow
        } else {
            return ItemNotSelectedArrow
        }
        // } else {
        //     return ItemNotSelectedArrow
        // }
    }

    setBackgroundColor(position) {
        if (this.state.active == position) {
            return "#E5F4F9";
        }
        return "#FFFFFF";
    }

    setAddressArrow(position) {

        // item is not selected
        if (this.state.active == null && this.state.addressHoverPosition == null) {
            return ItemNotSelectedArrow
            // item is not selected but hovered
        } else if (this.state.active == null && this.state.addressHoverPosition == position) {
            return ItemNotSelectedButHoveredArrow
            // item is selected but not hovered
        } else if (this.state.active == position && this.state.addressHoverPosition == null) {
            return AddressSelectedArrow
            // item is selected and hovered
        } else if (this.state.active == position && this.state.addressHoverPosition == position) {
            return ItemSelectedAndHoveredArrow
        } else {
            return ItemNotSelectedArrow
        }
    }

    onFilterSelect(eventKey) {
        this.setState({
            filter: eventKey,
        })

        console.log("eventKey on filter --> ", eventKey);

        axios.get(REPORT_DATA_ENDPOINT, {
            params: {
                'area': this.state.zipCode,
                'filter_type': eventKey,
            }
        }).then((response) => {
            var caseData;
            if (this.state.caseType == "home") {
                caseData = response.data['home_data']
            } else {
                caseData = response.data['work_data']
            }
            this.setState({
                data: response.data,
                caseData: caseData,
            })
        })
    }

    onFilterHover() {
        this.setState({
            filterHover: true,
        })
    }

    onFilterUnhover() {
        this.setState({
            filterHover: false,
        })
    }

    setFilterColor() {
        if (this.state.filterHover == true) {
            return "#CCE4ED"
        }
        return "#99D2E8"
    }

    setFilterIcon() {
        if (this.state.filterHover == true) {
            return FilterIconHovered
        } else {
            return FilterIconUnhovered
        }
    }

    render() {

        return (
            <div style={{ width: "550px" }}>
                {/* <Card>
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
                </Card> */}
                {this.state.zipCodeDataExists ?
                    (<div style={{ width: "550px" }}>
                        <Card>
                            <Card.Header id="address-container-header">
                                <h3 style={{ color: "white", }} id="address-container-header-text"><b>{this.state.data['home_data'].length + this.state.data['work_data'].length} Reported Addresses in {this.state.zipCode}</b></h3>
                                <Row style={{ height: "24px" }}>
                                    <Col >
                                        <Nav id="nav-container" variant="tabs" defaultActiveKey="#home" onSelect={this.onSelectAddress}>
                                            <Nav.Item id="nav-item">
                                                <Nav.Link href="#home"><b>Home ({this.state.data['home_data'].length})</b></Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item id="nav-item">
                                                <Nav.Link href="#work"><b>Work ({this.state.data['work_data'].length})</b></Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col>
                                        <div style={{ float: "right", marginRight: "18px" }}>
                                            <Dropdown alignRight id="filter-dropdown" onSelect={this.onFilterSelect.bind(this)}>
                                                <Dropdown.Toggle onMouseLeave={() => this.onFilterUnhover()} onMouseEnter={() => this.onFilterHover()} style={{ color: this.setFilterColor(), border: "#008EC6", backgroundColor: "#008EC6", }}>
                                                    <img style={{ paddingBottom: "2px" }} src={this.setFilterIcon()}></img>{this.state.filter}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item eventKey="All" >{this.state.filter === "All" || this.state.filter == "Filter" ? (<b>All</b>) : "All"}</Dropdown.Item>
                                                    <Dropdown.Item eventKey="COVID-Like" >{this.state.filter == "COVID-Like" ? (<b>COVID-Like</b>) : ("COVID-Like")}</Dropdown.Item>
                                                    <Dropdown.Item eventKey="COVID-Positive" >{this.state.filter == "COVID-Positive" ? (<b>COVID-Positive</b>) : ("COVID-Positive")}</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Accordion id="address-accordion" >
                                {this.state.caseData.map((item, index) => (
                                    <Card id="address-card" variant="flush">
                                        {/* style={{ backgroundColor: this.state.addressRow.backgroundColor }}  */}
                                        <Accordion.Toggle onMouseLeave={() => { this.onAddressUnhover(index) }} onMouseEnter={() => { this.onAddressHover(index) }} style={{ backgroundColor: this.setBackgroundColor(index), }} onClick={() => { this.onAddressToggle(index) }} id="address-accordion-toggle" as={Card.Header} eventKey={index}>
                                            <Row >
                                                <Col>
                                                    <div style={{ width: "300px", }}>
                                                        {item['address'].slice(0, item['address'].lastIndexOf(","))}
                                                    </div>
                                                </Col>
                                                <Col >
                                                    <div style={{ width: "100px", }}>
                                                        {item['num_reports']} reports
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <div style={{ width: "25px" }}>
                                                        <img className="address-expand-icon" src={this.setAddressArrow(index)}></img>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse id="address-accordion-collapser" eventKey={index}>
                                            <Card.Body id="address-card-body">
                                                {item['cases'].map((case_datum, ind) => (
                                                    <Accordion>
                                                        <Card id="report-card">
                                                            {this.state.activeReports[ind] = false}
                                                            <Accordion.Toggle id="report-accordion-toggle" onMouseLeave={() => { this.onReportUnhover(ind) }} onMouseEnter={() => { this.onReportHover(ind) }} as={Card.Header} eventKey={ind} onClick={() => { this.onReportToggle(ind) }}>
                                                                <Row>
                                                                    <Col>
                                                                        <div style={{ width: "275px" }}>
                                                                            {case_datum['name']} - {case_datum['age']}, {case_datum['gender']}
                                                                        </div>
                                                                    </Col>
                                                                    <Col >
                                                                        <div style={{ width: "125px" }}>
                                                                            {case_datum['phone_number']}
                                                                        </div>
                                                                    </Col>
                                                                    <Col>
                                                                        <div>
                                                                            <img className="address-expand-icon" src={this.setReportArrow(ind)}></img>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        {case_datum['flags']['tested'] === 'Negative' ? (
                                                                            <CovidNegativeBadge />
                                                                        ) : case_datum['flags']['tested'] === 'Awaiting Results' ? (
                                                                            <AwaitingResultsBadge />
                                                                        ) : (
                                                                                    <CovidPositiveBadge />
                                                                                )}
                                                                        {
                                                                            case_datum['flags']['symptomatic'] ? (
                                                                                <span style={{ marginLeft: "4px" }}>
                                                                                    <CovidLikeBadge />
                                                                                </span>
                                                                            ) :
                                                                                (<></>)
                                                                        }
                                                                    </Col>
                                                                </Row>
                                                            </Accordion.Toggle>
                                                            <Accordion.Collapse eventKey={ind}>
                                                                <Card.Body id="report-card-body">
                                                                    <hr></hr>
                                                                    <ul>
                                                                        <li><b>Reported</b> - {case_datum['reported']}</li>
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
                                                                                (<li><b>Household Sick</b> - members in house feel fine</li>)
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
                        <></>
                    )}
            </div>
        )
    }

}