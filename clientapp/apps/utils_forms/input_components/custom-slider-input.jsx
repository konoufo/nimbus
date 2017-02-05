import React from 'react';
// material-ui
import Slider from 'material-ui/lib/slider';
// forms
const FormsyText = require('apps/utils_forms/input_components/FormsyText');
// styles
import StylePropable from 'material-ui/lib/mixins/style-propable';

const CustomSliderInput = React.createClass({
	mixins: [
		StylePropable
	],

	propTypes: {
		name: React.PropTypes.string.isRequired,
		defaultValue: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number
	},

	contextTypes: {
	    formsy: React.PropTypes.object
	},

	childContextTypes: {
		formsy: React.PropTypes.object
	},

	getChildContext(){ 
		return {
			formsy: this.context.formsy,
		};
	},

	getDefaultProps() {
		return {
			required: true,
			defaultValue: 0,
			min: 0,
			max: 20,
			initMax: 20,
			maxAdjust: 0,
			unitText: '',
			style: {}
		};
	},

	getInitialState() {
		return {
			value: this.props.defaultValue,
			min: this.props.min,
			max: this.props.max,
		};
	},

	onChange(e, value) {
		this.setState({ 
			value: value || Number(e.target.value)
		});
	},

	getStyles() {
		return {
			fieldContainer: {
				textAlign:'center', 
				position: 'relative', 
				top: 10
			},
		};
	},

	isValid() {
		return this.refs['specialInput'].isValid();
	},

	render() {
		let {name,
			 validations,
			 validationError,
		 	 validationErrors,
		 	 defaultValue,
		 	 ...sliderProps} = this.props;
		validations = validations || '';		 	 
		validationError = validationError || '';
		validationErrors = validationErrors || {};
		sliderProps.max = this.state.value <= sliderProps.initMax - 2 ? sliderProps.initMax : 
			this.state.value + sliderProps.maxAdjust < sliderProps.max ?
			this.state.value + sliderProps.maxAdjust : sliderProps.max;
		let styles = this.getStyles();
		styles.fieldContainer = this.mergeStyles(styles.fieldContainer, this.props.fieldContainerStyle);

		return (
			<div style={this.props.style} className='col-group'>
		        <div className='col-8'>
		          <Slider
		          	name={`${name}-slider`}
		          	step={1}
		            {...sliderProps} // e.g. description="How much weight can you offer for this trip ?" required={true} min={0} max={20} step={1}
		            value={this.state.value}
		            onChange={this.onChange} />
		          
		        </div>
		        <div style={styles.fieldContainer} className='col-4'>
		          <FormsyText
		            ref="specialInput"
		            name={name}
		            value={this.state.value || 0}
		            validations={validations}
		            validationErrors={validationErrors}
		            validationError={validationError}
		            type="number"
		            min={sliderProps.min}
		            max={sliderProps.max}
		            required={sliderProps.required}
		            inputStyle={{textAlign: 'center'}} 
		            style={{width: '100%'}}
		            onChange={this.onChange} />
		            <span style={{fontSize: 10}}>
		              {this.props.unitText}
		            </span>
		        </div>
	        </div>
		)
	}
});

module.exports = CustomSliderInput;