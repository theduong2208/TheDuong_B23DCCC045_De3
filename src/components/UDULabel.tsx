
import React from 'react';
import { Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
};

const UDULabel = ({ label }: Props) => {
  return <Text style={styles.label}>{label}</Text>;
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default UDULabel;
