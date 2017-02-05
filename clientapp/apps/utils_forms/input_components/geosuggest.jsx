/* global google */

const React = require('react');
// material-ui
import FontIcon from 'material-ui/lib/font-icon';
import {orange200} from 'material-ui/lib/styles/colors';
import getMuiTheme from 'apps/15-1-mui/styles/getMuiTheme';
import AutoComplete from 'apps/15-1-mui/AutoComplete';

class Geosuggest extends React.Component {
  // constructor get props from parent
  constructor(props) {
    super(props);
    this.state = {
      isSuggestsHidden: props.initiallyHidden != null ? props.initiallyHidden : true,
      userInput: props.initialValue,
      error:{
        errorText:''
      },
      activeSuggest: null,
      suggests: [],
    };
  }

  getChildContext() {
      return {
          muiTheme: getMuiTheme()
      };
  }
  /**
   * Change inputValue if prop changes
   * @param {Object} props The new props
   */
  componentWillReceiveProps(props) {
    if (this.props.initialValue !== props.initialValue) {
      this.setState({userInput: props.initialValue});
    }
  }

  /**
   * Called on the client side after component is mounted.
   * Google api sdk object will be obtained and cached as a instance property.
   * Necessary objects of google api will also be determined and saved.
   */
  componentDidMount() {
    this.setInputValue(this.props.initialValue);

    var googleMaps = this.props.googleMaps
      || (google && google.maps) || this.googleMaps;

    if (!googleMaps) {
      console.error('Google map api was not found in the page.');
    } else {
      this.googleMaps = googleMaps;
    }

    this.autocompleteService = new googleMaps.places.AutocompleteService();
    this.geocoder = new googleMaps.Geocoder();
  }

  /**
   * Method used for setting initial value.
   * @param {string} value to set in input
   */
  setInputValue(value) {
    this.setState({
      userInput: value
    });
  }

  /**
   * Method used for setting error text on field.
   * @param {string} error text
   */
  setError(error) {
    this.setState({
      error:{
        errorText:error
      }
    });
    
  }

  /**
   * Method used for clearing error text on field.
   */
  clearError() {
    this.setState({
      error:{}
    });
  }

  /**
   *  Check validity of input (just checking existence for now)
  */
  isValid() {
    return !!this.state.userInput;
  }

  /**
   * When the input got changed
   * @param {String} searchText is the new input
   */
  onInputChange(searchText) {
    console.log(this.state.error);
    if (this.state.error.errorText) {
      this.clearError();
    }
    var userInput = searchText;

    this.setState({userInput: userInput}, function() {
      this.showSuggests();
      this.props.onChange(userInput, this.props.ref); // todo: get rid of this.props.ref hack ?
    }.bind(this));
  }

  // konoufo: Not Used
  /**
   * When the input gets focused
   */
  onFocus() {
    //this.clearError();
    this.props.onFocus();
    //this.showSuggests();
  }

  /**
   * Update the value of the user input
   * @param {String} value the new value of the user input
   */
  update(value) {
    this.setState({userInput: value});
    this.props.onChange(value);
  }

  /*
   * Clear the input and close the suggestion pane
   */
  clear() {
    this.setState({userInput: ''}, function() {
      this.hideSuggests();
    }.bind(this));
  }

  /**
   * Search for new suggests
   */
  searchSuggests() {
    if (!this.state.userInput) {
      this.updateSuggests();
      return;
    }

    var options = {
      input: this.state.userInput,
      language: 'fr-CA',
    };

    if (this.props.location) {
      options.location = this.props.location;
    }

    if (this.props.radius) {
      options.radius = this.props.radius;
    }

    if (this.props.bounds) {
      options.bounds = this.props.bounds;
    }

    if (this.props.types) {
      options.types = this.props.types;
    }

    if (this.props.country) {
      options.componentRestrictions = {
        country: this.props.country
      };
    }

    this.autocompleteService.getPlacePredictions(
      options,
      function(suggestsGoogle) {
        this.updateSuggests(suggestsGoogle);

        if (this.props.autoActivateFirstSuggest) {
          this.activateSuggest('next');
        }
      }.bind(this)
    );
  }

  /**
   * Update the suggests
   * @param  {Object} suggestsGoogle The new google suggests
   */
  updateSuggests(suggestsGoogle) {
    if (!suggestsGoogle) {
      suggestsGoogle = [];
    }

    var suggests = [],
      regex = new RegExp(this.state.userInput, 'gim'),
      skipSuggest = this.props.skipSuggest;

    this.props.fixtures.forEach(function(suggest) {
      if (!skipSuggest(suggest) && suggest.label.match(regex)) {
        suggest.placeId = suggest.label;
        suggests.push(suggest);
      }
    });

    suggestsGoogle.forEach(suggest => {
      if (!skipSuggest(suggest)) {
        suggests.push({
          label: this.props.getSuggestLabel(suggest),
          placeId: suggest.place_id
        });
      }
    });

    
    this.setState({suggests: suggests});
  }

  /**
   * When the input gets focused
   */
  showSuggests() {
    this.searchSuggests();
    this.setState({isSuggestsHidden: false});
  }

  /**
   * When the input loses focused
   */
  hideSuggests() {
    setTimeout(function() {
      this.setState({isSuggestsHidden: true});
    }.bind(this), 100);
    this.props.onBlur();
  }

  /**
   * When a key gets pressed in the input
   * @param  {Event} event The keypress event
   */
  onInputKeyDown(event) {
    switch (event.which) {
      case 40: // DOWN
        event.preventDefault();
        this.activateSuggest('next');
        break;
      case 38: // UP
        event.preventDefault();
        this.activateSuggest('prev');
        break;
      case 13: // ENTER
        event.preventDefault();
        this.selectSuggest(this.state.activeSuggest);
        break;
      case 9: // TAB
        this.selectSuggest(this.state.activeSuggest);
        break;
      case 27: // ESC
        this.hideSuggests();
        break;
      default:
        break;
    }
  }

  /**
   * Activate a new suggest
   * @param {String} direction The direction in which to activate new suggest
   */
  activateSuggest(direction) {
    if (this.state.isSuggestsHidden) {
      this.showSuggests();
      return;
    }

    var suggestsCount = this.state.suggests.length - 1,
      next = direction === 'next',
      newActiveSuggest = null,
      newIndex = 0,
      i = 0; // eslint-disable-line id-length

    for (i; i <= suggestsCount; i++) {
      if (this.state.suggests[i] === this.state.activeSuggest) {
        newIndex = next ? i + 1 : i - 1;
      }
    }

    if (!this.state.activeSuggest) {
      newIndex = next ? 0 : suggestsCount;
    }

    if (newIndex >= 0 && newIndex <= suggestsCount) {
      newActiveSuggest = this.state.suggests[newIndex];
    }

    this.setState({activeSuggest: newActiveSuggest});
  }

  /**
   * When an item got selected
   * @param {dataSourceItem} item The selected autocomplete dataSource item
   * @param {dataSourceIndex} index The selected autocomplete dataSource index
   * @param {dataSource} dataSource The dataSource prop of Autocomplete
   */
  selectSuggest(item, index) {
    console.log(item, index);
    let address = item.text || this.state.suggests[index] && this.state.suggests[index].label;
    if (!address) {
      return;
    }

    this.setState({
      isSuggestsHidden: true,
    });

    this.geocodeSuggest(address);
    
  }


  /**
   * Geocode an address
   * @param  {Object} address the Address
   */
  geocodeSuggest(address) {
    if (!address) {
      return;
    }
    let suggest = {};
    this.geocoder.geocode(
      {address: address},
      function(results, status) {
        if (status !== this.googleMaps.GeocoderStatus.OK) {
          return;
        }

        let gmaps = results[0],
          location = gmaps.geometry.location;
        let findComponent = function(gmaps, type){
          let component = gmaps.address_components.find((element) => {
            let index = element.types.indexOf(type);
            return (index>-1); 
          });
          if (type == 'administrative_area_level_1') {
            return component && component.short_name + ',' + component.long_name;
          }
          return component && component.long_name;
        };
        
        // suggest.country = findComponent(gmaps,'country');
        /*suggest.state = findComponent(gmaps,'administrative_area_level_1');
        suggest.city = findComponent(gmaps, 'administrative_area_level_3') || findComponent(gmaps, 'locality');
        console.log('country: '+suggest.country+'; state: '+suggest.state+'; city: '+suggest.city)*/
        
        suggest.location = {
          lat: location.lat(),
          lng: location.lng()
        };
        this.props.onSuggestSelect(suggest, address, this.props.ref);
        //this.props.onSuggestSelect(suggest);
      }.bind(this)
    );
  
  }

  /*
  * Render Item components
  * @return {Function} the React elements to be sent in Autocomplete
  */
  getItems() {
    return this.state.suggests.map(function(suggest){
        //return suggest.label;
        return  {
          text: suggest.label,
          value: (<AutoComplete.Item 
                    innerDivStyle={{textOverflow:'ellipsis'}}
                    style={{fontSize:'0.8em', }}
                    primaryText={<span style={{textOverflow: 'ellipsis'}} >{suggest.label}</span>} 
                    leftIcon={<FontIcon className="material-icons" style={{color: orange200, opacity:'0.4'}} >place</FontIcon>}/>)
        };
      });
  }

  /**
   * Render the view
   * @return {Function} The React element to render
   */
  render() {
    return (// eslint-disable-line no-extra-parens
      
        <AutoComplete 
          style={this.props.style}
          fullWidth={true}
          floatingLabelText={this.props.floatingLabelText}
          floatingLabelStyle={this.props.floatingLabelStyle}
          hintText={this.props.hintText || ''}
          ref={this.props.ref}
          name={this.props.name}
          searchText={this.state.userInput}
          errorText={this.state.error.errorText || this.props.errorText}
          errorStyle={this.state.error.errorText ? this.state.error.errorStyle : this.props.errorStyle}
          dataSource={this.getItems()}
          disabled={this.props.disabled}
          filter={() => true} 
          onKeyDown={this.onInputKeyDown.bind(this)}
          open={!this.state.isSuggestsHidden}
          onUpdateInput={this.onInputChange.bind(this)}
          openOnFocus={true}
          updateWhenFocused={true}
          showAllItems={true}
          onNewRequest = {this.selectSuggest.bind(this)} />
    );
  }
};

Geosuggest.defaultProps = {
  style: {},
  floatingLabelText: {},
  floatingLabelStyle:{},
  ref:'geosuggestInput',
  fixtures: [],
  initialValue: '',
  placeholder: 'Trouver une adresse',
  disabled: false,
  className: '',
  location: null,
  radius: null,
  bounds: null,
  country: null,
  types: ["(address)"],
  googleMaps: null,
  onSuggestSelect: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  skipSuggest: () => {},
  getSuggestLabel: suggest => suggest.description,
  autoActivateFirstSuggest: false
};

Geosuggest.childContextTypes = {
  muiTheme: React.PropTypes.object 
};

export default Geosuggest;