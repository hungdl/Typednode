/// <reference path="../../../../src/import.d.ts" />
/// <reference path="../../../../src/components/component.ts" />
/// <reference path="../../../../node_modules/rxjs-es/src/rx.ts" />
"use strict";
const React = require('react');
const ReactDOM = require('react-dom');
const Components = require('../../../../src/components/component');
var ExampleTable = React.createClass({
    getInitialState() {
        return {
            columnWidths: [
                250,
                null,
                null
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
        return (React.createElement("tr", {key: keyIndex, style: rowStyle}, React.createElement("td", {style: { width: computedColumnWidths[0] }}, itemIndex), React.createElement("td", {style: { width: computedColumnWidths[1] }}, "5 * itemIndex === ", 5 * itemIndex), React.createElement("td", {style: { width: computedColumnWidths[2] }}, Math.random() * 10000)));
    },
    getHeader(computedColumnWidths, rowWidth) {
        return (React.createElement("tr", null, React.createElement("th", {style: { width: computedColumnWidths[0] }}, "Id"), React.createElement("th", {style: { width: computedColumnWidths[1] }}, "Content"), React.createElement("th", {style: { width: computedColumnWidths[2] }}, "SDVXCf")));
    },
    render() {
        return (React.createElement(Components.Table, {containerHeight: 500, rowHeight: 50, rowsCount: 10000, getRow: this.getRow, getHeader: this.getHeader}));
    }
});
ReactDOM.render(React.createElement(ExampleTable, null), document.getElementById('app'));
