import React from 'react';
// mui
import SnackBar from 'material-ui/lib/Snackbar';

import demoApp from './demoApp.jsx';
import FormsyText from 'apps/utils_forms/input_components/FormsyText';
const Formsy = FormsyText.Formsy;
import {sendRequest} from 'apps/utils_forms/mixins/async-request-mixin';
import LoadingComponent from 'apps/utils_subpage/loading-component';
// styles
import Colors from 'material-ui/lib/styles/colors';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import DefaultRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';


export default React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
    locale: React.PropTypes.string,
  },

  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
      locale: 'fr-FR',
    };
  },

  getInitialState: function getInitialState(){
    let muiTheme = ThemeManager.getMuiTheme(DefaultRawTheme);
    return {
      muiTheme,
      cookiesAccepted: true,
    };
  },

  componentWillMount: function componentWillMount(){
    this.setState(window.initialData);

    this.sendRequest = sendRequest.bind(this);
  },

  acceptCookie: function() {
  	this.setState({cookiesAccepted: true});
  },

  onGeoUpdate: function onGeoUpdate(suggest, label, id){
    let state = {};
    state[id] = suggest;
    this.setState(state);
    
  },

  addNewStop: function addNewStop() {
    _self = this;
    if (!this.state.from || !this.state.to) return;
    suggest = this.state.from;
    model = {actionUrl: '/r/dispatch/'};
    model['from'] = `{lat: "${suggest.location.lat}", lng: "${suggest.location.lng}"}`;
    suggest = this.state.to;
    model['to'] = `{lat: "${suggest.location.lat}", lng: "${suggest.location.lng}"}`;
    this.sendRequest(model, function(res){_self.setState(res)});
  },

  render: function render() {
  	let styles = { 
    	a: {
        	color: Colors.darkWhite,
    	},
    	p: {
	        margin: '0 auto',
	        padding: 0,
	        color: Colors.lightWhite,
	        maxWidth: 335,
	    },
    };
  	return (
  		<div style={{width: '100%'}} >
  			{/*!this.state.cookiesAccepted && 
  				<SnackBar
  					message={<p>Cette page utilise des cookies. <a href="#">En savoir plus</a></p>}
  					style={{width: '100%'}}
  					action="D'accord"
  					openOnMount={true}
  					onActionTouchTap={this.acceptCookie}
  					onRequestClose={this.nop}
  				/>*/}
  			<div class="row" >
          <div class="col-md-12">
            <div class="col-sm-4">
              Bus: {this.state.Items.length}
            </div>
            <div class="col-sm-4">
              Requêtes: 
            </div>
            <div class="col-sm-4">
              <span class="hidden-xs">Temps gagné:</span> 0 minute(s)
            </div>
          </div>
          <div class="col-md-12">
            <div id="mapDemo">
            </div>
          </div>
          <FlatButton label="Démo" />
        </div>
        {this.state.submitStatus === 'pending' ? <LoadingComponent /> :
        <demoApp open={this.state.demoOpen} onGeoUpdate={this.onGeoUpdate} addNewStop={this.addNewStop} />}
      </div>
  	)
  },
})