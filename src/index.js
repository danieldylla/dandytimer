import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Timer from './components/Timer';
import * as serviceWorker from './serviceWorker';

import ReactGA from 'react-ga';
ReactGA.initialize('UA-136117398-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(<Timer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
