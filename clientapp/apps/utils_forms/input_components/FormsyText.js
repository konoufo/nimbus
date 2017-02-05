'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Formsy = require('formsy-react');
var TextField = require('material-ui/lib/text-field');

// We just added custom validation rule and this.props.onTChange
// TODO: Define onTChange meaning
//  TODO : put these in a mixin
Formsy.addValidationRule('isAllowedText', function (values, value) {
      if (!value){
        return true;
      }
      return /^[A-zÀ-ÿ0-9&\-'_]+(\s+[A-zÀ-ÿ0-9&\-'_]+)*$/.test(value.replace(/^\s+|\s+$/g, '')) ;
});

Formsy.addValidationRule('isMoreThan', function (values, value, operand) {
      if (!value) return true;
      return Number(value) > Number(operand);
});
  
var FormsyText = React.createClass({
  displayName: 'FormsyText',

  mixins: [Formsy.Mixin],

  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    type: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      onChange: () => {},
      type: 'text'
    };
  },

  handleChange: function handleChange(event) {
    if (this.props.onChange) this.props.onChange(event);
    if (this.getErrorMessage() != null) {
      this.setValue(event.currentTarget.value);
    } else {
      if (this.isValidValue(event.target.value)) {
        this.setValue(event.target.value);
      } else {
        this.setState({
          _value: event.currentTarget.value,
          _isPristine: false
        });
      }
    }
  },

  handleBlur: function handleBlur(event) {
    this.setValue(event.currentTarget.value);
  },

  handleEnterKeyDown: function handleEnterKeyDown(event) {
    this.setValue(event.currentTarget.value);
  },

  render: function render() {
    return React.createElement(TextField, _extends({}, this.props, {
      defaultValue: this.props.value,
      type: this.props.type,
      onChange: this.handleChange,
      onBlur: this.handleBlur,
      onEnterKeyDown: this.handleEnterKeyDown,
      errorText: this.getErrorMessage(),
      hintText: this.props.hintText,
      value: this.getValue() }));
  }
});
FormsyText.Formsy = Formsy;
module.exports = FormsyText;