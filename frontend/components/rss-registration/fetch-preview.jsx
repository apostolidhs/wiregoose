import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Col, Row, FormControl, Panel, Table }
  from 'react-bootstrap';
import ReactJson from 'react-json-view';

import ArticleBox from '../article-box/article-box.jsx';
import Loader from '../loader/loader.jsx';
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
              <td>{_.size(rssFeeds)}</td>
            </tr>
            <tr>
              <td>Errors</td>
              <td>{_.size(errors)}</td>
            </tr>
          </tbody>
        </Table>


        <h3>Errors</h3>
        <ReactJson src={errors} collapsed={true} theme="monokai" />

        <h3>Entries</h3>
        <ReactJson src={rssFeeds} collapsed={true} theme="monokai" />

        <h3>Preview</h3>
        <Panel>
          {_.map(rssFeeds, (rssFeed) =>
            <ArticleBox entry={rssFeed} key={`${rssFeed.title}-${rssFeed.description}`} />
          )}
        </Panel>
          {/*<Form horizontal>

            <FormGroup controlId="formIdLink" validationState={this.validateLink()}>
              <Col componentClass={ControlLabel} sm={2}>Link</Col>
              <Col sm={10}>
                <FormControl
                  type="text"
                  name="link"
                  value={link}
                  onChange={this.handleInputChange}
                  required
                />
              </Col>
            </FormGroup>

            <div>
              {_.map(rssFeeds, (rssFeed) =>
                <ArticleBox entry={rssFeed} />
              )}
            </div>

            <div className="clearfix">
              <Button bsStyle="primary"
                className="pull-right"
                type="submit"
                onClick={this.onSaveClicked}
                disabled={this.validateLink() !== 'success'}>
                <FontAwesome name="picture-o" /> Preview
              </Button>
            </div>

          </Form>*/}

        </Loader>
    );
  }

}
