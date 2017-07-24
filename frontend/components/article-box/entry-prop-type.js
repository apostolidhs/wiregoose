import PropTypes from 'prop-types';
import validateURL from 'react-proptypes-url-validator';

export default const entryPropType = {
  title: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  published: PropTypes.instanceOf(Date),
  link: validateURL,
  author: PropTypes.string,
  provider: PropTypes.string,
  category: PropTypes.string,
};
