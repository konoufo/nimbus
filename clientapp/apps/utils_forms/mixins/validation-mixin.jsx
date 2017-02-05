import React from 'react';

// wizard validation mixin
function scorePassword(password) {
    var score = 0;
    if (!(pass && pass.length >= 8) )
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);  
}

module.exports = {
  isInvalidStep: function isInvalidStep(stepNumber){
    return this.wizardSteps[stepNumber].some(function(inputRef, index){
        return this.refs[inputRef] != null && !this.refs[inputRef].isValid();
    }.bind(this))
  },

  getFirstInvalidStep: function getFirstInvalidStep(){
    let firstInvalidStep = this.numOfSteps - 1;
    this.wizardSteps.some(function(step, index){
      firstInvalidStep = index;
      return this.isInvalidStep(index);
    }.bind(this));
    return firstInvalidStep;
  },

  passwordMeter: function passwordMeter(words, colors, password) {
    var score = scorePassword(password);
    if (score > 80)
        return {text: words.strong, color: colors.strong};
    if (score > 60)
        return {text: words.good, color: colors.good};
    if (score >= 30)
        return {text: words.weak, color: colors.weak};

    return {text: words.veryWeak, color: colors.veryWeak};
  },

  isAllowedText: function isAllowedText(values, value) {
    if (!value){
      return true;
    }
    return /^[A-zÀ-ÿ0-9&\-'_,;.:]+(\s+[A-zÀ-ÿ0-9&\-'_,;.:]+)*$/.test(value.replace(/^\s+|\s+$/g, '')) ;
  },
  
  isLessThan: function isLessThan(values, value, testValue) {
    if (typeof value === 'undefined' || typeof testValue === 'undefined') return true;
    return Number(testValue) > Number(value);
  },

  addDateValidator: function addDateValidator(locale) {
    
    // Add specific validation rule for dates
    // Is it overkill to do this for our validation purposes ?
    Formsy.addValidationRule('isLaterThan', function (values, value, otherField) {
      // @param otherField: is the name of the field to compare to OR 'today'
      // @param value: is the value of the field being validated 
      let otherValue = values[otherField] || otherField;
      if(!value || !otherValue) {
        return true
      }

      let elemsDate1 = value.split('/');
      if (elemsDate1.length != 3) return false;
      let elemsDate2 = otherValue.split('/');
      if (elemsDate2.length != 3 && otherValue != 'today') return true;
      let date2 = new Date();
      let date1 = new Date();
      let dateLocale = locale || this.context.locale;
      if (dateLocale != null && dateLocale.indexOf('fr') > -1){
        date1 =  new Date(elemsDate1[2], elemsDate1[1], elemsDate1[0]);
        if (otherField != 'today') {
          date2 = new Date(elemsDate2[2], elemsDate2[1], elemsDate2[0]);
        }
      } else {
        date1 =  new Date(value);
        date2 = otherField != 'today' ?  new Date(values[otherField]) : date2;
      }
      date2.setHours(0,0,0);
      date1.setHours(0,0,0);
      return date1.getTime() >= date2.getTime();
    }.bind(this));

    Formsy.addValidationRule('isSoonerThan', function (values, value, otherField) {
      // @param otherField: is the name of the field to compare to OR 'today'
      // @param value: is the value of the field being validated 
      let otherValue = values[otherField] || otherField;
      if(!value || !otherValue) {
        return true
      }

      let elemsDate1 = value.split('/');
      if (elemsDate1.length != 3) return false;
      let elemsDate2 = otherValue.split('/');
      if (elemsDate2.length != 3 && otherValue != 'today') return true;
      let date2 = new Date();
      let date1 = new Date();
      if (this.context.locale != null && this.context.locale.indexOf('fr') > -1){
        date1 =  new Date(elemsDate1[2], elemsDate1[1], elemsDate1[0]);
        if (otherField != 'today') {
          date2 = new Date(elemsDate2[2], elemsDate2[1], elemsDate2[0]);
        }
      } else {
        date1 =  new Date(value);
        date2 = otherField != 'today' ?  new Date(values[otherField]) : date2;
      }
      date2.setHours(0,0,0);
      date1.setHours(0,0,0);
      return date1.getTime() <= date2.getTime();
    }.bind(this));
  },

  createDateValidator: function createDateValidator(locale){
      // @param otherField: is the name of the field to compare to OR 'today'
      // @param value: is the value of the field being validated
      
      function isLaterThan(values, value, otherField) {
        let otherValue = otherField.toLowerCase() != 'today' ? values[otherField] : 'today';
        if(!value || !otherValue) {
          return true
        }

        let elemsDate1 = value.split('/');
        if (elemsDate1.length != 3) return false;
        let elemsDate2 = otherValue.split('/');
        if (elemsDate2.length != 3 && otherValue != 'today') return true;
        let date2 = new Date();
        let date1 = new Date();
        let dateLocale = locale;
        if (dateLocale != null && dateLocale.indexOf('fr') > -1){
          date1 =  new Date(elemsDate1[2], elemsDate1[1] - 1, elemsDate1[0]);
          if (otherValue != 'today') {
            date2 = new Date(elemsDate2[2], elemsDate2[1] - 1, elemsDate2[0]);
          }
        } else {
          date1 =  new Date(value);
          date2 = otherField != 'today' ?  new Date(values[otherField]) : date2;
        }
        date2.setHours(0,0,0);
        date1.setHours(23,59,59);
        window.console.log('dateTested', date1, 'dateTester', date2);
        return date1.getTime() >= date2.getTime();
      }
      return {isLaterThan: isLaterThan};
  }
}