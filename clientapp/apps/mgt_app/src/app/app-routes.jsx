const React = require('react');
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

// Here we define all our pages ReactComponent.
const Master = require('./components/master');

/* Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */
const AppRoutes = (
  <Route path="/" component={Master} />
);

module.exports = AppRoutes;
