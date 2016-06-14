/// <reference path="../../../../src/import.d.ts" />
/// <reference path="../../../../src/components/component.ts" />
/// <reference path="../../../../node_modules/rxjs-es/src/rx.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs-es/src/rx';
import * as Components from '../../../../src/components/component';

var ExampleTable = React.createClass({
    getColumnWidths() {
        return {
            columnWidths: [
                250,
                0,
                0
            ]
        };
    },

    getRow(itemIndex, keyIndex, top, computedColumnWidths, rowWidth) {
        var rowStyle = {
            position: 'absolute',
            top: top,
            width: '100%',
            borderBottom: '1px solid grey'
        };
        return (
            <tr key={keyIndex} style={rowStyle}>
                <td style={{ width: computedColumnWidths[0] }}>{itemIndex}</td>
                <td style={{ width: computedColumnWidths[1] }}>5 * itemIndex === {5 * itemIndex}</td>
                <td style={{ width: computedColumnWidths[2] }}>{Math.random() * 10000}</td>
            </tr>
        );
    },

    getHeader(computedColumnWidths, rowWidth) {
        return (
            <tr>
                <th style={{ width: computedColumnWidths[0] }}>Id</th>
                <th style={{ width: computedColumnWidths[1] }}>Content</th>
                <th style={{ width: computedColumnWidths[2] }}>SDVXCf</th>
            </tr>
        );
    },

    render(): JSX.Element {

        return (
            <Components.Table
                containerHeight={500}
                rowHeight={50}
                rowsCount={10000}
                getRow={this.getRow}
                getHeader={this.getHeader}
                columnWidths={ [250, 0,0]}/>
        );
    }
});

ReactDOM.render(
    <ExampleTable/>,
    document.getElementById('app')
);