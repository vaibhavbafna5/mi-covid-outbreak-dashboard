import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import SearchIcon from "./icons/searchIcon.svg";

// const AVAILABLE_ZIPCODES_ENDPOINT = 'http://0.0.0.0:5000/available-zipcodes'
const AVAILABLE_ZIPCODES_ENDPOINT = 'https://still-cliffs-94162.herokuapp.com/available-zipcodes'

var t = "";

class Autocomplete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // suggested zipcodes from API
            suggestions: [],
            // The active selection's index
            activeSuggestion: 0,
            // The suggestions that match the user's input
            filteredSuggestions: [],
            // Whether or not the suggestion list is shown
            showSuggestions: false,
            // What the user has entered
            userInput: "",
        };
    }

    // makes an API request to get the available zip codes
    componentDidMount() {
        axios.get(AVAILABLE_ZIPCODES_ENDPOINT)
            .then(res => {
                this.setState({
                    suggestions: res.data['zipcodes']
                })
            })
    }

    // Event fired when the input value is changed
    onChange = e => {
        const userInput = e.currentTarget.value;

        // Filter our suggestions that don't contain the user's input
        const filteredSuggestions = this.state.suggestions.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        // Update the user input and filtered suggestions, reset the active
        // suggestion and make sure the suggestions are shown
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });

    };

    // onClick = e => {
    //     this.setState({
    //         activeSuggestion: 0,
    //         filteredSuggestions: [],
    //         showSuggestions: false,
    //         userInput: e.currentTarget.value,
    //     });

    //     this.props.onZipCodeChange(this.state.userInput)
    // };

    // Event fired when the user clicks on a suggestion
    onMouseDown = e => {
        const userInput = e.target.outerText;
        // Update the user input and reset the rest of the state
        console.log(userInput);
        if (userInput == "Statewide View") {
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: "",
            });

            this.props.onZipCodeChange("")
        } else {
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions: [],
                showSuggestions: false,
                userInput: e.target.outerText,
            });

            this.props.onZipCodeChange(e.target.outerText)
        }
    };

    // Remove suggestions when user clicks off search field
    onBlur = e => {
        console.log("hi")
        this.setState({
            showSuggestions: false,
        });
    };

    // Show suggestions when user clicks on search field (accounting for when user has typed, clicked out and then clicked back in search field)
    onFocus = e => {
        this.setState({
            showSuggestions: true,
        });
    }

    // Event fired when the user presses a key down
    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key, update the input and close the
        // suggestions
        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });
            this.props.onZipCodeChange(this.state.userInput)
        }
        // User pressed the up arrow, decrement the index
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow, increment the index
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onMouseDown,
            onKeyDown,
            onBlur,
            onFocus,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;

        let suggestionsListComponent;

        if (showSuggestions && userInput) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ListGroup style={{ position: "absolute", width: "202px", fontSize: "14px" }}>
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }

                            var t = '';
                            var m = '';

                            for (var i = 0; i <= userInput.length - 1; i++) {
                                t = t + suggestion.charAt(i);
                            };

                            for (var k = userInput.length; k < suggestion.length + 1; k++) {
                                m = m + suggestion.charAt(k);
                            }

                            return (
                                // absolute position style thing is being used 
                                // to make sure content doesn't get pushed down
                                <ListGroup.Item className="zipcode" style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", color: "black" }}
                                    key={suggestion}
                                    action onMouseDown={onMouseDown}>
                                    <div style={{ marginLeft: "19px" }}><b>{t}</b>{m}</div>
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                );
            } 

            else if (userInput == this.props.zipCode) {
                suggestionsListComponent = (
                    <ListGroup.Item className="zipcode" style={{ width: "202px", color: "black", fontSize: "14px"}}
                    action onMouseDown={onMouseDown}>
                        <div style={{ marginLeft: "19px" }}>Statewide View</div>
                    </ListGroup.Item>
                );
            }
            
            else {
                suggestionsListComponent = (
                    <ListGroup.Item className="no-zipcode" style={{ width: "202px", fontSize: "14px", fontStyle: "italic", textAlign: "center" }}>
                        <div style={{ display: "inline-block", textStyle: "italic" }}>No zipcodes found</div>
                    </ListGroup.Item>
                );
            }
        }

        // i = 0;

        return (
            <Fragment>
                {/* <Form style={{ width: "202px", borderWidth: "1px"}} inline="true"> */}
                <Form style={{ width: "202px", borderWidth: "1px", borderTopLeftRadius: "5px" }}>
                {/* <img onClick={onClick} src={SearchIcon} alt="Search Icon" /> */}
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text style={{ backgroundColor: "white", border: "0", width: "41px" }}> <img src={SearchIcon} alt="Search Icon" /></InputGroup.Text>
                        </InputGroup.Prepend>

                        <Form.Control type="text" value={userInput} onChange={onChange} onBlur={onBlur} onFocus={onFocus} placeholder="Search zipcode"></Form.Control>
                    </InputGroup>
                </Form>
                {suggestionsListComponent}
            </Fragment>
        );
    }
}

export default Autocomplete;