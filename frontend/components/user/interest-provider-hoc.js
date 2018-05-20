import debounce from 'lodash/debounce';
import React from 'react';
import PropTypes from 'prop-types';

import {isAuthenticated, launchAuthModal} from '../authorization/auth.js';
import {getInterest, toggleInterest} from '../user/interests.js';
import {EventHOC} from '../events/events.js';

export default function withInterestProvider(WrappedComponent) {
  class InterestProviderHOC extends React.Component {

    static propTypes = {
      interest: PropTypes.any.isRequired
    }

    state = {
      hasInterest: false
    }

    constructor() {
      super();
      //this.toggleInterest = debounce(this.toggleInterest.bind(this), 1000);
      this.toggleInterestBackend = debounce(this.toggleInterestBackend.bind(this), 1000);
    }

    componentWillMount() {
      const hasInterest = isAuthenticated() && !!getInterest(this.props.interest);
      this.setState({hasInterest});
    }

    componentWillReceiveProps(nextProps) {
      const hasInterest = isAuthenticated() && !!getInterest(nextProps.interest);
      this.setState({hasInterest});
    }

    toggleInterestBackend() {
      const togglePromise = toggleInterest(this.props.interest, !this.state.hasInterest);
      if (togglePromise) {
        togglePromise
          .finally(() => this.setState({hasInterest: !!getInterest(this.props.interest)}));
      }
    }

    toggleInterest = () => {
      const updateInterest = () => {
        if (!isAuthenticated()) {
          return;
        }

        this.setState({hasInterest: !this.state.hasInterest});
        this.toggleInterestBackend();
      }

      if (!isAuthenticated()) {
        const prompt = this.renderLoginPrompt();
        return launchAuthModal({type: 'LOGIN', prompt})
          .then(() => updateInterest());
      }

      updateInterest();
    }

    renderLoginPrompt() {
      return (
        <h3>Select you interests</h3>
      );
    }

    render() {
      const {hasInterest} = this.state;

      return <WrappedComponent
        hasInterest={hasInterest}
        toggleInterest={this.toggleInterest}
        {...this.props}
      />;
    }
  }

  return EventHOC(InterestProviderHOC, ['interests']);
}
