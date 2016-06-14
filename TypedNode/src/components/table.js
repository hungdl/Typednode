/// <reference path="../import.d.ts" />
"use strict";
const React = require('react');
const ReactDOM = require('react-dom');
const Rx = require('rxjs-es/src/rx');
class Table extends React.Component {
    constructor() {
        super();
    }
    render() {
        // render the container first,
        // then render into that later with knowledge of the container
        var containerStyle = {
            position: 'relative',
            height: this.props.containerHeight,
            overflowX: 'hidden'
        };
        return (React.createElement("div", null, React.createElement("div", {ref: (ctrl) => this.headerContainerNode = ctrl}), React.createElement("div", {ref: (ctrl) => this.containerNode = ctrl, style: containerStyle})));
    }
    componentDidMount() {
        // get the nodes and store them, don't want to look them up every time
        this.headerContainerNode = ReactDOM.findDOMNode(this.headerContainerNode);
        this.containerNode = ReactDOM.findDOMNode(this.containerNode);
        // set up the table and the scroll observer
        this.initializeTable();
        // have the component rerender when the window resizes,
        // as the container width might have changed
        var windowResizeStream = Rx.Observable.fromEvent(window, 'resize').debounceTime(50);
        this.windowResizeSubscription = windowResizeStream.subscribe(() => {
            this.forceUpdate();
        });
    }
    componentDidUpdate() {
        // do the actual render when the component updates itself
        var containerWidth = this.containerNode.offsetWidth;
        var computedColumnWidths = Table.getColumnWidths(containerWidth, this.props.columnWidths);
        var output = this.deferredRender(computedColumnWidths, containerWidth);
        ReactDOM.render(output, this.containerNode);
        // render the header with the same constraints as the rows
        ReactDOM.render((React.createElement("table", null, React.createElement("thead", null, this.props.getHeader(computedColumnWidths, containerWidth)))), this.headerContainerNode);
    }
    componentWillUnmount() {
        this.visibleIndicesSubscription.unsubscribe();
        this.windowResizeSubscription.unsubscribe();
        ReactDOM.unmountComponentAtNode(this.containerNode);
        ReactDOM.unmountComponentAtNode(this.headerContainerNode);
    }
    static getColumnWidths(rowWidth, columnWidths) {
        class Compulation {
            constructor(autoSizeColumnsCount, remainningWidth) {
                this.autoSizeColumnsCount = autoSizeColumnsCount;
                this.remainningWidth = remainningWidth;
            }
        }
        ;
        var columnsCount = columnWidths.length;
        var computation = columnWidths.reduce((agg, width) => {
            agg.remainningWidth -= width;
            agg.autoSizeColumnsCount -= 1;
            return agg;
        }, new Compulation(columnsCount, rowWidth));
        var standardWidth = computation.remainningWidth / computation.autoSizeColumnsCount;
        return columnWidths.map(width => {
            if (width != null) {
                return width;
            }
            else {
                return standardWidth;
            }
        });
    }
    deferredRender(columnWidths, containerWidth) {
        var rows = this.state.visibleIndices.map((itemIndex, keyIndex) => {
            var top = itemIndex * this.props.rowHeight;
            return this.props.getRow(itemIndex, keyIndex, top, columnWidths, containerWidth);
        });
        return (React.createElement("table", {style: { height: this.props.rowsCount * this.props.rowHeight }}, React.createElement("tbody", null, rows)));
    }
    initializeTable() {
        var containerHeight = this.props.containerHeight;
        var rowHeight = this.props.rowHeight;
        var rowsCount = this.props.rowsCount;
        var visibleRows = Math.ceil(containerHeight / rowHeight);
        var initialScrollSubject = new Rx.ReplaySubject(1);
        initialScrollSubject.next(this.containerNode.scrollTop);
        var scrollTopStream = initialScrollSubject.merge(Rx.Observable.fromEvent(this.containerNode, 'scroll').map(() => this.containerNode.scrollTop));
        var firstVisibleRowStream = scrollTopStream.map((scrollTop) => {
            return Math.floor(scrollTop / rowHeight);
        }).distinctUntilChanged();
        var visibleIndicesStream = firstVisibleRowStream.map((firstVisibleRowIndex) => {
            var visibleIndices = new Array();
            var lastVisibleRowIndex = firstVisibleRowIndex + visibleRows + 1;
            if (lastVisibleRowIndex > rowsCount) {
                firstVisibleRowIndex -= lastVisibleRowIndex - rowsCount;
            }
            for (var i = 0; i <= visibleRows; i++) {
                visibleIndices.push(Number(i + firstVisibleRowIndex));
            }
            return visibleIndices;
        });
        this.visibleIndicesSubscription = visibleIndicesStream.subscribe((indices) => {
            this.setState({ visibleIndices: indices });
        });
    }
}
exports.Table = Table;
