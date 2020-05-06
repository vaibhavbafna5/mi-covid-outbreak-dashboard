import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import XYAxis from './axis/xy-axis';
import Line from './line/line';
import { line, curveMonotoneX } from 'd3-shape';
import { extent } from 'd3-array';
import { transition } from 'd3-transition';

export default class Chart extends Component {

    constructor(props) {
        super(props);
        // make API request here to get cumulative/weekly data for a given zipcode
        this.state = {
            data: [
                { name: 'Mar 08', value: 2 },
                { name: 'Mar 15', value: 120 },
                { name: 'Mar 22', value: 1479 },
                { name: 'Mar 29', value: 5273 },
                { name: 'Apr 05', value: 9717 },
                { name: 'Apr 12', value: 8033 },
                { name: 'Apr 19', value: 6408 },
                { name: 'Apr 26', value: 6148 },
                { name: 'May 03', value: 5207 },
            ],
            zipcode: '',
            dataType: 'weekly',
            cumulativeData: [
                { name: 'Mar 08', value: 2 },
                { name: 'Mar 15', value: 122 },
                { name: 'Mar 22', value: 1601 },
                { name: 'Mar 29', value: 6874 },
                { name: 'Apr 05', value: 16591 },
                { name: 'Apr 12', value: 24624 },
                { name: 'Apr 19', value: 31032 },
                { name: 'Apr 26', value: 37180 },
                { name: 'May 03', value: 42387 },
            ],
            weeklyData: [
                { name: 'Mar 08', value: 2 },
                { name: 'Mar 15', value: 120 },
                { name: 'Mar 22', value: 1479 },
                { name: 'Mar 29', value: 5273 },
                { name: 'Apr 05', value: 9717 },
                { name: 'Apr 12', value: 8033 },
                { name: 'Apr 19', value: 6408 },
                { name: 'Apr 26', value: 6148 },
                { name: 'May 03', value: 5207 },
            ]
        }
    }

    setData(event) {
        console.log(event.target.value);
        var newData = []
        if (event.target.value == 'weekly') {
            newData = this.state.weeklyData
        } else {
            newData = this.state.cumulativeData;
        }
        this.setState({
            data: newData,
        })
    }

    render() {
        const data = this.state.data

        const parentWidth = 500;

        const margins = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 100,
        }
        const width = parentWidth - margins.left - margins.right;
        const height = 200 - margins.top - margins.bottom;

        const ticks = 5;
        const t = transition().duration(1000);

        const xScale = scaleBand()
            .domain(data.map(d => d.name))
            .rangeRound([0, width]).padding(0.1);

        const yScale = scaleLinear()
            .domain(extent(data, d => d.value))
            .range([height, 0])
            .nice();

        const lineGenerator = line()
            .x(d => xScale(d.name))
            .y(d => yScale(d.value))
            .curve(curveMonotoneX);

        return (
            <div>
                <div onChange={this.setData.bind(this)}>
                    <input type="radio" value="cumulative" name="gender" /> Show cumulative cases
                    <input type="radio" value="weekly" name="gender" defaultChecked /> Show weekly cases
                </div>
                <svg
                    width={width + margins.left + margins.right}
                    height={height + margins.top + margins.bottom}
                >
                    <g transform={`translate(${margins.left}, ${margins.top})`}>
                        <XYAxis {...{ xScale, yScale, height, ticks, t }} />
                        <Line data={data} xScale={xScale} yScale={yScale} lineGenerator={lineGenerator} width={width} height={height} />
                    </g>
                </svg>
            </div>
        );


    }
}