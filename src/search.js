import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup'

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
            userInput: ""
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

    // Event fired when the user clicks on a suggestion
    onClick = e => {
        // Update the user input and reset the rest of the state
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });

        this.props.onZipCodeChange(this.state.userInput)

    };

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
            onKeyDown,
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
                    <ListGroup style={{ position: "absolute", width: "202px", fontSize:"14px"}}>
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

                                <ListGroup.Item style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px", color: "black"}}
                                    key={suggestion}
                                    action onClick={onClick}>
                                    <b>{t}</b>{m}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                );
            } else {
                // suggestionsListComponent = (
                //     <ListGroup.Item style={{ position: "absolute", }}>
                //         <em>No zipcodes found</em>
                //     </ListGroup.Item>
                suggestionsListComponent = (
                    <ListGroup.Item style={{ width: "202px", fontSize:"14px", fontStyle:"italic", textAlign: "center" }}>
                        <div style={{display:"inline-block", textStyle:"italic"}}>No zipcode found</div>
                        {/* <em>Please enter a 5 digit zipcode</em> */}
                    </ListGroup.Item>
                );
            }
        }

        // i = 0;

        return (
            <Fragment>
                <Form style={{ width: "202px"}}>
                {/* <img src ="./icons/searchIcon.svg"></img> */}
                    <Form.Control type="text" value={userInput} onChange={onChange} placeholder="Search for a zipcode" />
                </Form>
                {suggestionsListComponent}
            </Fragment>
        );
    }
}

export default Autocomplete;