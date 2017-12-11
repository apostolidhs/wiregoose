import _ from 'lodash';
import React from 'react';

const events = {};

export function subscribe(name, func) {
  const queue = events[name] || [];
  events[name] = queue;

  queue.push(func);
}

export function unsubscribe(name, func) {
  _.remove(events[name], queueFunc => queueFunc === func);
}

export function publish(name, data) {
  _.each(events[name], queueFunc => queueFunc(data, name));
}

export function EventHOC(WrappedComponent, events) {
  if (_.isEmpty(events)) {
    throw new Error('Should contain at least one event');
  }

  return class Event extends React.Component {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`;

    state = {events: {}}

    componentWillMount() {
      _.each(events, event => subscribe(event, this.updateComponent));
    }

    componentWillUnmount() {
      _.each(events, event => unsubscribe(event, this.updateComponent));
    }

    updateComponent = (data, eventName) => {
      this.setState({events: {
          ...this.state.events,
          [eventName]: data
        }
      });
    }

    render() {
      return (<WrappedComponent events={this.state.events} {...this.props} />);
    }
  }
}

function getDisplayName(component) {
  return component.displayName
    || component.name
    || 'Component';
}
