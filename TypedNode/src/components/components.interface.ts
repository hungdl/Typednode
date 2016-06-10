interface IColumnWidth {
    remainingWidth: number;
    customWidthColumns: number;
}

interface ITableProps {
    rowsCount: number;
    rowHeight: number;
    containerHeight: number;
    getRow(itemIndex: number, keyIndex: number, top: number, computedColumnWidths: Array<number>, rowWidth: number): JSX.Element;
    getHeader(computedColumnWidths: Array<number>, containerWidth: number): JSX.Element;
}

interface ITableStage {
    visibleIndices: Array<any>;
    columnWidths: Array<number>;
}