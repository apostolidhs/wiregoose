import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import SizeMe from 'react-sizeme';
import Sidebar from 'react-sidebar';

import { publish } from '../../components/events/events.js';
import componentSize from '../../components/responsible/component-size.js';
import styles from './timeline.less';
import SidebarContent from './sidebar/sidebar.jsx';

@SizeMe({ refreshRate: 500 })
@CSSModules(styles, {
  allowMultiple: true,
})
export default class Timeline extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    size: componentSize.propType
  }

  static defaultProps = {
    size: componentSize.defaultProps,
  }

  state = {
    sidebar: {
      openLeftSidebarClicked: () => this.onSetSidebarOpen(!this.state.sidebar.isLeftSidebarOpen),
      isLeftSidebarOpen: false,
      isLeftSidebarEnabled: false
    }
  }

  constructor() {
    super();
    this.isSidebarDockedCalc = componentSize.sizeFormatter({
      md: false,
    }, true);
  }

  componentWillMount() {
    publish('sidebar', this.state.sidebar);
  }

  componentWillUnmount() {
    publish('sidebar', {
      isLeftSidebarEnabled: false
    });
  }

  onSetSidebarOpen = (open) => {
    const sidebar = this.state.sidebar;
    sidebar.isLeftSidebarOpen = open;
    this.setState({ sidebar });
    publish('sidebar', sidebar);
  }

  render() {
    const {
      children,
      size,
      ...passDownProps
    } = this.props;

    const isSidebarDocked = this.state.sidebar.isLeftSidebarEnabled
        && this.isSidebarDockedCalc(size.width);

    return (
      <div styleName={"container-wrapper" + (isSidebarDocked ? ' sidebar-docked' : '')}>
        <div className="container" >
          {children}
        </div>
      </div>
    );

    // return (
    //   <Sidebar
    //     styles={{
    //       root: {
    //         top: 50
    //       },
    //       sidebar: {
    //         width: '250px'
    //       },
    //       content: {
    //         padding: '15px'
    //       }
    //     }}
    //     contentClassName="w-left-sidebar"
    //     docked={isSidebarDocked}
    //     sidebar={<SidebarContent />}
    //     touch={false}
    //     open={this.state.sidebar.isLeftSidebarOpen}
    //     onSetOpen={this.state.sidebar.onSetSidebarOpen}
    //   >
    //     <div styleName={"container-wrapper" + (isSidebarDocked ? ' sidebar-docked' : '')}>
    //       <div className="container" >
    //         {children}
    //       </div>
    //     </div>
    //   </Sidebar>
    // );
  }

}
