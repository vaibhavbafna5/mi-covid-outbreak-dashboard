import React, { Component } from 'react';
import ReactDom from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './map.css'

mapboxgl.accessToken = 'pk.eyJ1IjoidmJhZm5hIiwiYSI6ImNrOXVibHJ3eTAwNHozb3Bkb283OGMxencifQ.56atAF7TgHun-Df8GMsYYQ';

const countyTileset = 'counties_v17a-3qtxmg'
const countyTilesetSrc = {
    type: 'vector',
    url: 'mapbox://caoa.1wm38rfu',
}


export default class MichiganMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lng: -84.597,
            lat: 44.48,
            zoom: 4.98,
        }
    }

    componentDidMount() {

        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('load', () => {
            map.addLayer({
                "id": "county-border",
                "type": "line",
                "source": countyTilesetSrc,
                "source-layer": countyTileset,
                "layout": { 'visibility': 'visible' },
                "paint": {
                    "line-width": 1,
                    "line-color": "#fff",
                },
            });
        });

    }

    render() {
        return (
            <div>
                <div className="mapContainer" ref={el => this.mapContainer = el}></div>
            </div>
        )
    }


}