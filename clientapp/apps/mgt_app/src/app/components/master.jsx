import React from 'react';
// mui
import SnackBar from 'material-ui/Snackbar';
// styles
import Colors from 'material-ui/styles/colors';
import ThemeManager from 'material-ui/styles/theme-manager';
import DefaultRawTheme from 'material-ui/styles/raw-themes/light-raw-theme';

export default class Master extends React.Component {

  constructor (props) {
  	super(props);
    let muiTheme = ThemeManager.getMuiTheme(DefaultRawTheme);
    // To switch to RTL...
    // muiTheme.isRtl = true;
    this.state = {
      muiTheme,
      cookiesAccepted: true,
    };
  }

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
    locale: React.PropTypes.string,
  };

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
      locale: 'fr-FR',
    };
  }

  acceptCookie = () => {
  	this.setState({cookiesAccepted: true});
  }

  nop = () => {}

  render() {
  	let styles = { 
  		footer: {
	        backgroundColor: Colors.grey900,
	        marginTop: 20,
	        padding: '3em 0',
	        textAlign: 'center',
	    },
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
  			{!this.state.cookiesAccepted && 
  				<SnackBar
  					message={<p>Cette page utilise des cookies. <a href="#">En savoir plus</a></p>}
  					style={{width: '100%'}}
  					action="D'accord"
  					openOnMount={true}
  					onActionTouchTap={this.acceptCookie}
  					onRequestClose={this.nop}
  				/>}
  			<div class="row" >

  			</div>
        </div>
  	)
  }
}