/// <reference path="../import.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Rx from 'rxjs-es/src/rx';

class Table extends React.Component<ITableProps, ITableStage> {
    private containerNode: HTMLElement;
    private headerContainerNode: HTMLElement;

    private visibleIndicesSubscription: Rx.Subscription;
    private windowResizeSubscription : Rx.Subscription;

    constructor() {
        super();
    }

    public render(): JSX.Element {
        // render the container first,
        // then render into that later with knowledge of the container
        var containerStyle = {
            position: 'relative',
            height: this.props.containerHeight,
            overflowX: 'hidden'
        };

        return (
            <div>
                <div ref={(ctrl)  => this.headerContainerNode = ctrl }/>
                <div ref={(ctrl) => this.containerNode = ctrl}
                     style={containerStyle} />
            </div>
        );
    }

    public componentDidMount(): void {
        // get the nodes and store them, don't want to look them up every time
        this.headerContainerNode = ReactDOM.findDOMNode<HTMLElement>(this.headerContainerNode);
        this.containerNode = ReactDOM.findDOMNode<HTMLElement>(this.containerNode);

        // set up the table and the scroll observer
        this.initializeTable();

        // have the component rerender when the window resizes,
        // as the container width might have changed
        var windowResizeStream = Rx.Observable.fromEvent(window, 'resize').debounceTime(50);
        this.windowResizeSubscription = windowResizeStream.subscribe(() => {
            this.forceUpdate();
        });
    }

    public  componentDidUpdate(): void {
        // do the actual render when the component updates itself
        var containerWidth = this.containerNode.offsetWidth;
        var computedColumnWidths = Table.getColumnWidths(containerWidth, this.props.columnWidths);
        var output = this.deferredRender(computedColumnWidths, containerWidth);
        ReactDOM.render(output, this.containerNode);

        // render the header with the same constraints as the rows
        ReactDOM.render(
            (<table>
                <thead>
                    {this.props.getHeader(computedColumnWidths, containerWidth)}
                </thead>
             </table>),
            this.headerContainerNode);
    }

    public componentWillUnmount() {
        this.visibleIndicesSubscription.unsubscribe();
        this.windowResizeSubscription.unsubscribe();
        ReactDOM.unmountComponentAtNode(this.containerNode);
        ReactDOM.unmountComponentAtNode(this.headerContainerNode);
    }

    private static getColumnWidths(rowWidth: number, columnWidths: Array<number>): Array<number> {

        class Compulation {
            public autoSizeColumnsCount: number;
            public remainningWidth: number;

            constructor(autoSizeColumnsCount: number, remainningWidth: number) {
                this.autoSizeColumnsCount = autoSizeColumnsCount;
                this.remainningWidth = remainningWidth;
            }
        };

        var columnsCount = columnWidths.length;
        var computation: Compulation = columnWidths.reduce((agg: Compulation, width: number): any => {
                agg.remainningWidth -= width;
                agg.autoSizeColumnsCount -= 1;
                return agg;
            },
            new Compulation(columnsCount, rowWidth)
        );

        var standardWidth = computation.remainningWidth / computation.autoSizeColumnsCount;
        return columnWidths.map<number>(width => {
            if (width != null) {
                return width;
            } else {
                return standardWidth;
            }
        });
    }

    private deferredRender(columnWidths: Array<number>, containerWidth: number): JSX.Element {
        var rows = this.state.visibleIndices.map((itemIndex, keyIndex) => {
            var top = itemIndex * this.props.rowHeight;
            return this.props.getRow(itemIndex, keyIndex, top, columnWidths, containerWidth);
        });

        return (<table style={{ height: this.props.rowsCount * this.props.rowHeight }}>
                    <tbody>{rows}</tbody>
                </table>);
    }

    private initializeTable(): void {

        var containerHeight = this.props.containerHeight;
        var rowHeight = this.props.rowHeight;
        var rowsCount = this.props.rowsCount;

        var visibleRows = Math.ceil(containerHeight / rowHeight);

        var initialScrollSubject = new Rx.ReplaySubject(1);
        initialScrollSubject.next(this.containerNode.scrollTop);

        var scrollTopStream = initialScrollSubject.merge(
            Rx.Observable.fromEvent(this.containerNode, 'scroll').map(() => this.containerNode.scrollTop)
        );

        var firstVisibleRowStream = scrollTopStream.map((scrollTop: number) => {
            return Math.floor(scrollTop / rowHeight);
        }).distinctUntilChanged();
        
        var visibleIndicesStream = firstVisibleRowStream.map((firstVisibleRowIndex: number) => {
            var visibleIndices = new Array<number>();
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
            this.setState({ visibleIndices: indices } as ITableStage);
        });
    }
}

export {
Table
}