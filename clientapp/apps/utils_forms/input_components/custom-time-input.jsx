import React from 'react';
// material-ui
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import TimePicker from 'apps/15-1-mui/Timepicker';
import getMuiTheme from 'apps/15-1-mui/styles/getMuiTheme';
// forms & inputs
import Formsy from 'formsy-react';
const FormComponentMixin = require('apps/utils_forms/mixins/FormComponentMixin');
// style
import StylePropable from 'material-ui/lib/mixins/style-propable';
import StyleResizable from 'material-ui/lib/mixins/style-resizable';

const CustomTimeInput = React.createClass({
  
  mixins:[
    StylePropable,
    StyleResizable,
    FormComponentMixin,
    Formsy.Mixin,
  ],

  propTypes:{
    name:React.PropTypes.string.isRequired,
    validations: React.PropTypes.string,
    validationErrors: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object ]),
    onTouchTap:React.PropTypes.func,
    style:React.PropTypes.object,
    iconStyle:React.PropTypes.object,
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: getMuiTheme(),
    }
  },

  getDefaultProps(){
    return ({
      onTouchTap: () => {},
    })
  },

  getInitialState(){
    return({
      locale:'en-US',
    });
  },

  onChange(n, datetime) {
    let options = {timeZone: 'UTC', hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric'};
    this.handleValueChange(n, Intl.DateTimeFormat('en-US', options).format(datetime));
  },

  render(){

    return (
    <div className="col-group" style={{paddingTop:10, paddingBottom:8}} >
      <div className="col-mb-12" style={{paddingRight:0}}>
        <div className="col-mb-1" style={{padding: 0,}} >
          <FontIcon className="material-icons" 
            style={{color: this.props.iconColor || 'black', top: this.getErrorMessage() ? 20 : 40}} >access_time</FontIcon>
        </div>
        <div className="col-mb-9 col-xmb-9" style={{paddingRight:0}} >
          <TimePicker
            ref="specialInput"
            name={this.props.name}
            hintText={this.getErrorMessage() || this.props.hintText}
            errorText={this.getErrorMessage()}
            floatingLabelText={this.getErrorMessage() || this.props.hintText ? undefined : this.props.label || 'Date'}
            floatingLabelStyle={{zIndex: 0}}
            textFieldStyle={this.mergeStyles(this.props.style, {marginBottom:'1.3em', maxWidth:'100%', minWidth:'95%'})}
            validations={this.props.validations}
            validationErrors={
              typeof this.props.validationErrors === 'object' ? 
                this.props.validationErrors : {}}
            validationError={
              typeof this.props.validationErrors === 'string' ? 
                this.props.validationErrors : this.props.validationError || ''}
            required={typeof this.props.required !== 'undefined' ? this.props.required : true}
            format={this.props.format}
            autoOk={this.props.autoOk}
            onChange={this.onChange}
           />
         </div>
      </div>
    </div> );
  },

  
});

module.exports = CustomTimeInput;