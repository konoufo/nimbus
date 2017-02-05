import React from 'react';

import {pureMergeStyles as mergeStyles} from 'apps/utils_style';


export default function makeFieldWithIcon(FieldComponent) {
	return class FieldWithIcon extends React.Component {
		constructor(props) {
			super(props);
		}
		static propTypes = {
			name: React.PropTypes.string.isRequired,
			icon: React.PropTypes.node,
			iconStyle: React.PropTypes.object
		};

		static contextTypes = {
			formsy: React.PropTypes.object,
		};

		static childContextTypes = {
			formsy: React.PropTypes.object,
		};

		getChildContext() {
			return {
				formsy: this.context.formsy,
			}
		}

		render() {
			const defaultIconStyle = {
				top: 40,
			};
			let iconStyle = mergeStyles(defaultIconStyle, this.props.iconStyle);
			return (
				<div className="col-group">
					{this.props.icon && <div className="col-mb-1">
							{React.cloneElement(this.props.icon, {style: iconStyle})}
						</div>}
					<div className="col-mb-9 col-xmb-9">
						<FieldComponent {...this.props} />
					</div>
				</div>
			)
		}
	} 
}