// For the most part, these should be omnipresent in dialog/modals
// The need to set up mixins was obvious

module.exports = {
  closeDialog: function closeDialog() {
    this.setState({open:false});
    if (this.props.onRequestClose) this.props.onRequestClose();
  },

  openDialog: function openDialog() {
    this.setState({open:true});
  },

};