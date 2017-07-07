import { Form, FormGroup, Col, FormControl }
  from 'react-bootstrap';

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
    rssFeeds: []
  }

  fetchRssFeedSource = () => {
    const link = this.state.link;
    WiregooseApi.rssFeed.fetchRssFeed(link)
      .then(resp => {
        this.pro({
          rssFeeds: resp.data.data
        });
      });
  }

  validateLink = () => (isUri(this.state.record.link) ? 'success' : 'warning');

  render() {
    const {
      rssFeeds
    } = this.state;

    const {
      link
    } = this.props;

    return (
      <Loader ref="load">
          <Form horizontal>

            {/*<FormGroup controlId="formIdLink" validationState={this.validateLink()}>
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
            </FormGroup>*/}

            <div>
              {(_.map(rssFeeds, (rssFeed) =>
                <ArticleBox entry={rssFeed} />
              )())}
            </div>

            {/*<div className="clearfix">
              <Button bsStyle="primary"
                className="pull-right"
                type="submit"
                onClick={this.onSaveClicked}
                disabled={this.validateLink() !== 'success'}>
                <FontAwesome name="picture-o" /> Preview
              </Button>
            </div>*/}

          </Form>

        </Loader>
    );
  }

}
