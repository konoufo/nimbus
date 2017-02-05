'use strict';

/*
* @param (object) : a (label field modified) suggest object from Google Autocomplete Places [cities]
* @output (string) : city address formatted as "city, [state short, state long,] country"
*/
function _filterGeoInput(suggest){
    return(
      (suggest.country.toLowerCase().indexOf('united states') > -1 || 
        suggest.country.toLowerCase().indexOf('canada') > -1) ? [suggest.city, suggest.state, suggest.country].filter(function(s){
        return s != ''}).join(', ') : suggest.label
    );
}

module.exports = {
  // when a autocomplete suggest is selected, the user may subsequently 
  // input another value.
  // If no other suggest is selected afterwards, the last selected suggest
  // stay stored in state as the current input value (which is not quite right).
  // So we've got to clear the state on any user input following
  // a suggest selection until the next suggest selection.
  _clearOrKeep: function _clearOrKeep(userInput, ref){
    let self = this;
    if ( typeof userInput === 'string' && userInput.trim() == ''){
      let iState = {};
      iState[ref] = {label:''};
      self.setState(iState);
    } else {
      self.refs[ref].update(!!self.state.suggest ? self.state.suggest.label : '');
    }
  },
  // ...
	_handleGeoInput: function _handleGeoInput(suggest, address, ref){
	  let self = this;	
      let iState = {};
      suggest.label = address;
      suggest.label = _filterGeoInput(suggest);
      iState[ref] = suggest;
      self.setState(iState);
	},
  hasGeoInput: function hasGeoInput(){
    let self = this;
    return !self.getGeoInputsRefs().some(function(ref){
      return !self.state[ref];
    })
  },
  getGeoInput: function getGeoInput(){
    let self = this;
    return self.getGeoInputsRefs().map(function(ref){
      return self.state[ref]
    })
  },
  onGeoInputSubmit: function onGeoInputSubmit(){
    let self = this;
    if (self.hasGeoInput()){
      if (self.submitGeoInput != null){
        self.submitGeoInput();
        return
      }
     self.props.router.push({
        pathname: self.getGeoInputNextPath(),
        query: self.getGeoInputQuery(),
        state: {
          geoInput1: self.state[self.getGeoInputsRefs()[0]],
          geoInput2: self.state[self.getGeoInputsRefs()[1]],
        }
     });
      return;
    }
    self.getGeoInputsRefs().map(function(ref){
      let testinput = !self.state[ref] ? 
          self.refs[ref].setError('Please select a city.') : 'RAS on ' + ref;
      console.log(testinput);
    })
                    
  },

  _filterGeoInput: _filterGeoInput,

};