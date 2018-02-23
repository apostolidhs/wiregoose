import React from 'react';
import PropTypes from 'prop-types';
import has from 'lodash/has';

const componentSize = {
  propType: createPropType(),
  defaultProps: {
    width: 0,
  },
  xxs: 320,
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  isXxs,
  isXs,
  isSm,
  isMd,
  isLg,
  sizeFormatter,
};

export default componentSize;

function createPropType() {
  return PropTypes.shape({
    width: PropTypes.number,
  });
}

function isXxs(width) {
  return width <= componentSize.xs;
}

function isXs(width) {
  return width > componentSize.xs && width <= componentSize.sm;
}

function isSm(width) {
  return width > componentSize.sm && width <= componentSize.md;
}

function isMd(width) {
  return width > componentSize.md && width <= componentSize.lg;
}

function isLg(width) {
  return width > componentSize.lg;
}

function sizeFormatter(breakpoints, defaultValue) {
  return (width) => {
    if (isXxs(width)) {
      return getValue('xxs');
    } else if (isXs(width)) {
      return getValue('xs');
    } else if (isSm(width)) {
      return getValue('sm');
    } else if (isMd(width)) {
      return getValue('md');
    } else if (isLg(width)) {
      return getValue('lg');
    }
  };

  function getValue(breakpoint) {
    return has(breakpoints, breakpoint)
          ? breakpoints[breakpoint]
          : defaultValue;
  }
}






