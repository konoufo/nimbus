import React from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import Geosuggest from 'apps/utils_forms/input_components/geosuggest';


export default function demoApp(props){
	let style = {
		formElement: {
	        color:'white',
	        marginTop:'-9px',
	        padding: '0px 8px',
	        position:'relative',
	        
	     },
	};
	return (props.open ? 
	<div style={{position: 'absolute', left: -150, padding: '12px 8px'}}>
		<div class="row">
			<div class="col-md-12">
				<Geosuggest style={styles.formElement} floatingLabelText="Départ" 
					onSuggestSelect={(suggest, label)=>{props.onGeoUpdate(suggest, label, 'from')}} />
			</div>
			<div class="col-md-12">
				<Geosuggest style={styles.formElement} floatingLabelText="Arrivée" 
					onSuggestSelect={(suggest, label)=>{props.onGeoUpdate(suggest, label, 'to')}} />
			</div>
			<div class="col-md-12 text-center">
				<RaisedButton label="Impero!" onTouchTap={props.addNewStop}/>
			</div>
		</div>
	</div> : '')
}