import React, {Component, PropTypes} from 'react';
// 15-1-mui
import getMuiTheme from 'apps/15-1-mui/styles/getMuiTheme';
import SelectField from 'apps/15-1-mui/SelectField';
// forms
import HOC from 'formsy-react/lib/HOC';


class CustomSelectField extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	static defaultProps = {
		onChange: () => {},
	};

	static contextTypes = {
		formsy: PropTypes.object.isRequired,
		muiTheme: PropTypes.object,
	};

	static childContextTypes = {
		muiTheme: PropTypes.object,
	};

	getChildContext(){
		muiTheme: this.context.muiTheme || getMuiTheme();
	}

	_handleSelectionChange = (event, index, value) => {
		this.props.setValue(value);
		this.props.onChange(value);
	}

	render() {
		let {onChange,
			...otherProps} = this.props;
		return (
			<SelectField
				{...otherProps} 
				value={this.props.getValue()}
				onChange={this._handleSelectionChange} 
				errorText={!this.props.isValid() ? this.props.getErrorMessage() : this.props.hintText} >
				{this.props.children}
			</SelectField>
		)
	}
}

export default HOC(CustomSelectField);