import React from 'react';
import ReactDOM from 'react-dom';

import PSAGraph from './components/PSAGraph';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.decapitalize = function () {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

ReactDOM.render(
    <PSAGraph url="data/psa.csv" />,
    document.querySelectorAll('.psagraph')[0]
);
