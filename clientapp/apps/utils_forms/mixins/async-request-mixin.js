// send request to api and handle response
import request from 'superagent';
import cookie from 'react-cookie';


function _handleProgress() {
    let _self = this;
	_self.setState({
      submitStatus: 'pending',
    });
}

function _handleAlertClose() {
	let _self = this;
	_self.setState({
	    submitStatus: 'idle',
	})
}

module.exports = {
	sendRequest: function sendRequest(model, reset, invalidate) {
		let _self = this;
		let locale = model.locale || this.state.locale || this.context && this.context.locale || navigator.language;
		let formData = new FormData();
		for (let fieldName in model) {
	      if (model.hasOwnProperty(fieldName) && typeof model[fieldName] != 'undefined'){
	        formData.append(fieldName, model[fieldName])
	      }
	    }

	    request
	      .post(model.actionUrl)
	      .send(formData)
	      .set({'X-CSRFToken': cookie.load('csrftoken'), Accept: 'application/json'})
	      .on('progress', function(){
	        _self._handleProgress && _self._handleProgress() || _handleProgress.call(_self);
	      })
	      .end(function(err, res){
	     	_self.setState({
	            lastSubmit: new Date().getTime(),
	            submitStatus: 'done',
	        });
	        if (!err && !!res.body){
				_self.setState({
				    alert: res.body.messages && res.body.messages[0],
				});
				console.log(JSON.stringify(res.body));
				if (res.body.success) {
					_self.setState({submitSuccess: true});
					_self.afterSuccess ? _self.afterSuccess(res.body, reset, invalidate) : reset && reset(res.body);
				} else {
					if (res.body.errors && res.body.errors.non_specific) { 
						_self.setState({
				          alert: res.body.errors.non_specific,
				        }, function(){
							_self.afterError ? _self.afterError(res.body, reset, invalidate) : invalidate && invalidate();
						})
					} else {
						_self.afterError ? _self.afterError(res.body, reset, invalidate) : invalidate && invalidate();;
					}
				}
				return
	        }
	       	  _self.setState({
	          alert: locale.indexOf('fr') > -1 ? "Erreur inattendue. Réessayez plus tard ou contactez-nous si vous avez besoin d'aide." :
	          	 'Unexpected Error. Try again later or get in touch with us if you need help.'
	        }, function(){
	        		if (_self.afterFatalError) _self.afterFatalError(reset, invalidate);
	        	}
	        );
	     });
	},

	queryRequest: function queryRequest(query, cbSuccess, cbError) {
		let _self = this;
		let state = {loadingStatus: 'done'};
		let locale = query.locale || this.state.locale || navigator.language;
		request
			.get(query.actionUrl)
			.set({'X-CSRFToken': cookie.load('csrftoken'), Accept: 'application/json'})
			.query(query)
			.on('progress', function() {
				_self.setState({loadingStatus: 'pending'});
			})
			.end(function(err, res) {
				if(!err && !!res.body) {
					if (res.body.success) {
						state.loadingSuccess = true;
						console.log(res.body.data);
						cbSuccess && cbSuccess(res.body);
					} else {
						state.loadingSuccess = false;
						cbError && cbError(res.body.errors);
					}

					_self.setState(state);
					return
				}
				state.alert = gettext ? gettext('Unexpected Error. Try again later or get in touch with us if you need help.') :
								locale.indexOf('fr') > -1 ? "Erreur inattendue. Réessayez plus tard ou contactez-nous si" +
									" vous avez besoin d'aide." :
	          	 					'Unexpected Error. Try again later or get in touch with us if you need help.';
				_self.setState(state);
			})
	},
	/*
	* :param {object} errors: each key is a form field name; corresponding value is a list of errors.
	* :param {string} (Optional) formRefArg: ref of our Form component
	*/
	updateWithServerValidation: function updateWithServerValidation(errors, formRefArg) {
		let formRef = formRefArg || this.formRefArg;
		this.refs[formRef].updateInputsWithError(errors);
	},
	
	_handleProgress: _handleProgress,

	_handleAlertClose: _handleAlertClose

};