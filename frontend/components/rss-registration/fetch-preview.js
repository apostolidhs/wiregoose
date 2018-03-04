import size from 'lodash/size';
import map from 'lodash/map';
import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import FormControl from 'react-bootstrap/lib/FormControl';
import Panel from 'react-bootstrap/lib/Panel';
import Table from 'react-bootstrap/lib/Table';
import ReactJson from 'react-json-view';

import ArticleBox from '../article-box/article-box.js';
import Loader from '../loader/loader.js';
import * as WiregooseApi from '../services/wiregoose-api.js';

export default class FetchPreview extends React.Component {

  static propTypes = {
    link: PropTypes.string,
  }

  static defaultProps = {
    link: ''
  }

  state = {
    rssFeeds: [],
    errors: undefined,
    currentLink: ''
  }

  componentWillReceiveProps = ({ link }) => {
    if (this.state.currentLink !== link && link) {
      this.setState({ currentLink: link }, this.fetchRssFeedSource);
    }
  }

  fetchRssFeedSource = () => {
    const { currentLink } = this.state;

    this.refs.load.promise = WiregooseApi.rssFeed.fetchRssFeed(currentLink)
      .then(resp => {
        const { link } = this.props;
        if (currentLink === link) {
          const data = resp.data.data;
          this.setState({
            rssFeeds: data.entries,
            errors: data.errors
          });
        }
      });
  }

  validateLink = () => (isUri(this.state.record.link) ? 'success' : 'warning');

  render() {
    const {
      rssFeeds,
      errors
    } = this.state;

    const {
      link,
      ...passDownProps
    } = this.props;

    return (
      <Loader ref="load" {...passDownProps}>
        <h2>Rss Feed Fetch Report</h2>
        <Table responsive>
          <tbody>
            <tr>
              <td>Entries</td>
              <td>{size(rssFeeds)}</td>
            </tr>
            <tr>
              <td>Errors</td>
              <td>{size(errors)}</td>
            </tr>
          </tbody>
        </Table>

        <h3>Errors</h3>
        <ReactJson src={errors} collapsed={true} theme="monokai" />

        <h3>Entries</h3>
        <ReactJson src={rssFeeds} collapsed={true} theme="monokai" />

        <h3>Preview</h3>
        <Panel>
          {map(rssFeeds, (rssFeed) =>
            <ArticleBox entry={rssFeed} key={`${rssFeed.title}-${rssFeed.description}`} />
          )}
        </Panel>
      </Loader>
    );
  }

}
