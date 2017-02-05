import React from 'react';
var _simpleAssign = require('simple-assign');
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';


/*
* given an object and a suffix, finds every existing key where there is another key with say suffix,
  and then merges both values;
*/
function loadWithSuffix(obj, suffix){
  for (let key in obj) {
      let keySuffixed = `${key}When${suffix}`;
      if (obj.hasOwnProperty(keySuffixed)) {
        obj[key] = mergeStyles(obj[key], obj[keySuffixed]);
      }
  }
  return obj
}


/*
* merging objects of css style attributes
*/
export function mergeStyles() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return _simpleAssign.apply(undefined, [{}].concat(args));
}


/*
* Generate HOC with pass utility functions which help make styling responsive;
  This provide the same functionality as the mixin functions. It's just more suitable
  to the new "es6 class" React components.
*/
function withResponsiveStyle(Component){
	class ResponsiveComponent extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				width: this.props.width,
			}
		}

		componentWillReceiveProps(nextProps) {
			nextProps.width != this.state.width && this.setState({width: nextProps.width});
		}

		makeResponsive(styleObj) {
		
			if (this.props.width < LARGE) {
				styleObj = loadWithSuffix(styleObj, 'Medium');
				if (this.props.width < MEDIUM) {
					styleObj = loadWithSuffix(styleObj, 'Small');
				}
			} else if (this.props.width > MEDIUM) {
			  styleObj = loadWithSuffix(styleObj, 'Large');
			}
			return styleObj;
		}

		render() {
			let {width, ...otherProps} = this.props;
			return <Component {...otherProps} width={this.state.width} makeResponsive={this.makeResponsive.bind(this)} />
		}
	}
	return withWidth()(ResponsiveComponent);
}

export default withResponsiveStyle;