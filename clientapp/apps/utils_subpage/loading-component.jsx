import React from 'react';

import CircularProgress from 'material-ui/lib/circular-progress';


export default class LoadingComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div style={{margin: '48px auto', padding: '48px 8px', textAlign: 'center', width:'100%'}}>
			<CircularProgress 
				size={this.props.size || 1}
			/>
		</div>
	}
}