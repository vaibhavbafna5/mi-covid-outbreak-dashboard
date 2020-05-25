import React, { Component, Fragment } from "react";
import { Navbar, NavDropdown, Nav} from 'react-bootstrap';
import styles from './nav.module.css';
import LogoMark from './icons/logo.svg';
import cx from 'classnames';


export default class TopNav extends Component {
    render() {
        return (
            <Navbar className={styles.topNav} collapseOnSelect expand="lg">
                <Navbar.Brand><img className={styles.logoMark} src={LogoMark} alt="Logo Mark"/></Navbar.Brand>

                <Navbar.Brand className={ cx(styles.noGutters, styles.headers) }>
                    <h1 className={ cx(styles.noGutters, styles.header) }>COVID-19 Outbreak Tracker</h1>
                    <h5 className={ cx(styles.noGutters, styles.subheader) }>Surfacing the most recent self-reports of MiSymptom users</h5>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav" className={styles.justifyContentEnd}>
                    <Nav className= { cx(styles.noGutters, styles.navItems) }>
                        <Nav.Link href="#dashboard" active>Dashboard</Nav.Link>
                        <Nav.Link href="#about" className={styles.navItem}>About</Nav.Link>
                        {/* <Nav.Link href="#about" className={styles.navItem} onToggle="true">Logout</Nav.Link> */}
                        <Nav.Link href="#logout" className={styles.navItem} onToggle="false"><div className={styles.logoutButton}>Logout</div></Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>  
        );
    };
}