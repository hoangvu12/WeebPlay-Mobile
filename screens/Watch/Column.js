/* eslint-disable react/prop-types */
import React from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale } from "../../utils/scale";

const Column = ({ as: Component = View, children, style }) => (
  <Component style={[styles.column, style]}>{children}</Component>
);

export default Column;

const styles = StyleSheet.create({
  column: {
    flex: 1,
    padding: moderateScale(20),
  },
});
