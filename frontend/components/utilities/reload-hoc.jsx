import React from 'react';

export default function withReload(WrappedComponent) {
  return class ReloadHOC extends React.Component {
    state = {reRender: false}

    componentWillReceiveProps({routeParams}) {
      if (this.props.routeParams && this.props.routeParams.id !== routeParams.id) {
        this.setState({reRender: true});
        setTimeout(() => this.setState({reRender: false}), 0);
      }
    }

    render () {
      if (this.state.reRender) {
        return null;
      }
      return <WrappedComponent {...this.props}/>;
    }
  }
}
