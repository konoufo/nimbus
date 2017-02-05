import createHashHistory from 'history/lib/createHashHistory';
import Router from 'react-router/lib/Router';
import useRouterHistory from 'react-router/lib/useRouterHistory';

const runApp = function () {
  let React = require('react');
  let ReactDOM = require('react-dom');
  //let AppRoutes = require('./app-routes.jsx');
  let injectTapEventPlugin = require('react-tap-event-plugin');
  let Master = require('./components/master.jsx');
  

  //Helpers for debugging
  // window.react for React Developer Tools
  window.React = React;
  // window.Perf = require('react-addons-perf');

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // Parse Integration
  // Parse.initialize("klbOkOlVQAXEoxlDC6se9Rh1ybgpL2cebV2V3ZYE","fP6rCqUiQrNibUHE35Ydhl9pmGVdIRADzTqn9yXB");
  
  // Render the main app react component into the app div.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  //ReactDOM.render(<Main />, document.getElementById('app'));
  /**
 * Render the main app component. You can read more about the react-router here:
 * https://github.com/rackt/react-router/blob/master/docs/guides/overview.md
 */
const createAppHistory = useRouterHistory(createHashHistory);

const appHistory = createAppHistory();

/*ReactDOM.render(
  <Master />
, document.getElementById('app'));*/


};
if (!global.Intl) {
    require.ensure([
        'intl',
        'intl/locale-data/jsonp/en.js',
        'intl/locale-data/jsonp/fr.js'
    ], function (require) {
        require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/fr.js');
        runApp()
    });
} else {
    runApp()
}