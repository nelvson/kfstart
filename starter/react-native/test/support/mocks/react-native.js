import React, {PropTypes, DOM} from 'react';

function mockComponent(type) {
  return React.createClass({
    displayName: type,
    propTypes: {
      children: PropTypes.node,
    },
    render() {
      let {props} = this;
      return React.createElement(DOM.div, props, props.children);
    },
  });
}

export const View = mockComponent('View');
export const Text = mockComponent('Text');
export const ScrollView = mockComponent('ScrollView');
export const TextInput = mockComponent('TextInput');
export const TouchableHighlight = mockComponent('TouchableHighlight');
export const StyleSheet = {
  create: (ss) => ss,
};

export * from 'react';

export default {
  ...React,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableHighlight,
  StyleSheet,
};
