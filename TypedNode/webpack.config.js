"use strict";

var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToUITests = path.resolve('test/ui-tests/components');

var pathToTableTest = path.resolve(pathToUITests, 'table/table.tsx');

var pathToReact = path.resolve(node_modules, 'react/dist/react-with-addons.js');
var pathToReacDom = path.resolve(node_modules, 'react-dom/dist/react-dom.min.js');

module.exports = {
    entry: {
        tableTests: pathToTableTest
    },

    output: {
        path: "./js",
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'babel-loader!ts-loader' },
            { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM&harmony' },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.scss$/, loader: "style!css!sass!" }
        ]
    },

    resolve: {
        alias: [
            { 'react': pathToReact },
            { 'react-dom': pathToReacDom }
        ],
        modulesDirectories: ['web_modules', 'node_modules'],
        extensions: ['', '.js', '.jsx', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css']
    },
    devServer: {
        contentBase: ".",
        host: "localhost",
        port: 9000
    }
};