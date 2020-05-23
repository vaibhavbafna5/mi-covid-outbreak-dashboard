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
import Spinner from 'react-bootstrap/Spinner';

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
            filter: "All",
            filterHover: false,
            loading: false,
        }
    }

    componentWillMount() {
        //

        // axios.get(REPORT_DATA_ENDPOINT, {
        //     params: {
        //         'area': 'statewide',
        //         'filter_type': 'all',
        //     }
        // })
        //     // get state level report data 
        //     .then(res => {
        //         this.setState({
        //             data: res.data,
        //             loading: false,
        //         })
        //         console.log("merp", this.state)
        //     })
    }

    componentWillReceiveProps(newProps) {
        // get zip code level data
        var newZipCode = newProps.zipCode

        if (newProps.zipCode !== this.props.zipCode) {
            console.log("newZipCode here --> ", newZipCode)
            if (newZipCode == "" || newZipCode == "statewide") {
                this.setState({
                    zipCodeDataExists: false,
                    zipCode: "",
                    data: {},
                    caseData: {},
                    loading: false,
                })
            } else {
                this.setState({
                    zipCodeDataExists: false,
                    loading: true,
                })
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
                        loading: false,
                    })
                }).catch((e) => {
                    console.log("error", e);
                });
            }
        }
    }

    onSelectAddress = (eventKey) => {
        if (eventKey == "work") {
            var workData = this.state.data['work_data']
            this.setState({
                caseData: workData,
                caseType: "work"
            })
        } else {
            var homeData = this.state.data['home_data']
            this.setState({
                caseData: homeData,
                caseType: "home"
            })
        }
    }

    onAddressToggle(position) {
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

    setNumOfReportsBackgroundColor(position) {
        if (this.state.active == position) {
            return "#FFFFFF";
        }
        return "#E5F4F9";
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
                {this.state.loading ? (
                    <Row className="justify-content-center">
                        <div style={{ paddingTop: "88px" }}>
                            <Spinner style={{ color: "#008EC6" }} animation="border" />
                        </div>
                    </Row>
                ) :
                    this.state.zipCodeDataExists ? (<div style={{ width: "550px" }}>
                        <Card style={{ border: "none" }}>
                            <Card.Header id="address-container-header">
                                <h3 style={{ color: "white", fontSize: "20px", marginTop: "0" }} id="address-container-header-text"><b>{this.state.data['home_data'].length + this.state.data['work_data'].length} Addresses in {this.state.zipCode}</b></h3>
                                <Row style={{ marginTop: "0px" }}>
                                    <Col>
                                        <Nav activeKey={this.state.caseType} onSelect={this.onSelectAddress} style={{ fontSize: "13px", fontWeight: "600" }}>
                                            <Nav.Item id="nav-item" style={{ marginRight: "24px" }}>
                                                <Nav.Link eventKey={"home"}>Home ({this.state.data['home_data'].length})</Nav.Link>

                                            </Nav.Item>
                                            <Nav.Item id="nav-item">
                                                <Nav.Link eventKey={"work"}>Work ({this.state.data['work_data'].length})</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Col>
                                    <Col>
                                        <div style={{ float: "right", marginRight: "-16px" }}>
                                            <Dropdown alignRight id="filter-dropdown" onSelect={this.onFilterSelect.bind(this)} style={{ marginTop: "-10px" }}>
                                                <Dropdown.Toggle onMouseLeave={() => this.onFilterUnhover()} onMouseEnter={() => this.onFilterHover()} style={{ color: this.setFilterColor(), border: "#008EC6", fontSize: "13px", fontWeight: "600" }}>
                                                    <img style={{ paddingBottom: "2px" }} src={this.setFilterIcon()}></img>{this.state.filter}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item className="no-gutters" eventKey="All" >{this.state.filter === "All" ? (<h5 className="medium, current-dropdown-item">All</h5>) : (<h5 className="regular">All</h5>)}</Dropdown.Item>
                                                    <div className="dropdown-divider"></div>
                                                    <Dropdown.Item className="no-gutters" eventKey="COVID-Like" >{this.state.filter == "COVID-Like" ? (<h5 className="medium, current-dropdown-item">COVID-Like</h5>) : (<h5 className="regular">COVID-Like</h5>)}</Dropdown.Item>
                                                    <div className="dropdown-divider"></div>
                                                    <Dropdown.Item className="no-gutters" eventKey="COVID-Positive" >{this.state.filter == "COVID-Positive" ? (<h5 className="medium, current-dropdown-item">COVID-Positive</h5>) : (<h5 className="regular">COVID-Positive</h5>)}</Dropdown.Item>
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
                                        <Accordion.Toggle onMouseLeave={() => { this.onAddressUnhover(index) }} onMouseEnter={() => { this.onAddressHover(index) }} style={{ backgroundColor: this.setBackgroundColor(index), }} onClick={() => { this.onAddressToggle(index) }} id="address-accordion-toggle" as={Card.Header} eventKey={index} className="no-gutters">
                                            <Row className="address-row">
                                                {/* <Col> */}
                                                <h3 style={{ marginLeft: "32px", lineHeight: "53px", width: "450px", display: "inline-block" }}>
                                                    {item['address'].slice(0, item['address'].lastIndexOf(",")).replace(/[0-9]/g, "X")}
                                                </h3>
                                                {/* </Col> */}
                                                {/* <Col className="no-gutters"> */}
                                                <h4 style={{ color: "#008EC6", backgroundColor: this.setNumOfReportsBackgroundColor(index), width: "23px", height: "23px", lineHeight: "23px", lineWidth: "23px", borderRadius: "12px", textAlign: "center", marginTop: "15px", marginLeft: "3px", display: "inline-block" }}>{item['num_reports']}</h4>
                                                {/* </Col> */}
                                                {/* <Col className="no-gutters" style={{backgroundColor:"purple"}}> */}
                                                <div style={{ lineHeight: "53px", width: "28px", position: "absolute", right: "0", marginRight: "9px" }}>
                                                    <img className="address-expand-icon" stle src={this.setAddressArrow(index)}></img>
                                                </div>
                                                {/* </Col> */}
                                            </Row>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse id="address-accordion-collapser" eventKey={index}>
                                            <Card.Body id="address-card-body">
                                                {item['cases'].map((case_datum, ind) => (
                                                    <Accordion>
                                                        <Card id="report-card">
                                                            {this.state.activeReports[ind] = false}
                                                            <Accordion.Toggle className="no-gutters" id="report-accordion-toggle" onMouseLeave={() => { this.onReportUnhover(ind) }} onMouseEnter={() => { this.onReportHover(ind) }} as={Card.Header} eventKey={ind} onClick={() => { this.onReportToggle(ind) }}>
                                                                <Row className="report-row">
                                                                    <h4 className="black" style={{ width: "275px", display: "inline-block", marginTop: "12px", marginLeft: "31px", fontWeight: "500" }}>
                                                                        {case_datum['name'].replace(/./g, 'X')} - {case_datum['age']}, {case_datum['gender']}
                                                                    </h4>
                                                                    <h4 className="medium" style={{ width: "125px", display: "inline-block", marginTop: "12px", marginLeft: "78px", color: "#51646D", textAlign: "right" }}>
                                                                        {case_datum['phone_number'].replace(/[0-9]/g, "X")}
                                                                    </h4>
                                                                    <div style={{ width: "28px", position: "absolute", right: "0", marginRight: "9px", lineHeight: "72px" }}>
                                                                        <img className="address-expand-icon" src={this.setReportArrow(ind)}></img>
                                                                    </div>
                                                                </Row>
                                                                <Row>
                                                                    <Col style={{ marginLeft: "16px" }}>
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
                                                                <Card.Body id="report-card-body" className="no-gutters">
                                                                    <div className="report-divider"></div>
                                                                    <ul>
                                                                        <li><span className="report-list-item-label">Reported:</span> {case_datum['reported']}</li>
                                                                        <li><span className="report-list-item-label">Temperature:</span> {case_datum['temperature']}</li>
                                                                        <li><span className="report-list-item-label">Symptoms:</span> {case_datum['symptoms']}</li>
                                                                        <li><span className="report-list-item-label">Covid+ Contact:</span> {case_datum['covid_contacted']}</li>
                                                                        {
                                                                            case_datum['work_address'] == "" ? (
                                                                                // <p>No work address reported</p>
                                                                                <></>
                                                                            ) : (
                                                                                    <li><span className="report-list-item-label">Work address:</span> {case_datum['work_address']}</li>
                                                                                )
                                                                        }
                                                                        {
                                                                            case_datum['household_sick'] ? (
                                                                                <li><span className="report-list-item-label">Household Sick:</span> members in house are feeling unwell</li>
                                                                            ) :
                                                                                (<li><span className="report-list-item-label">Household Sick:</span> members in house feel fine</li>)
                                                                        }
                                                                        {
                                                                            case_datum['flags']['symptomatic'] ? (
                                                                                <li><span className="report-list-item-label">Symptomatic:</span> yes, COVID-like illness reported</li>
                                                                            ) :
                                                                                (<li><span className="report-list-item-label">Symptomatic:</span> no symptoms of a COVID-like illness reported</li>)
                                                                        }
                                                                        <li><span className="report-list-item-label">Tested:</span> {case_datum['flags']['tested']}</li>
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