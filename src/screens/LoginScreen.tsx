
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import UDULabel from '../components/UDULabel';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <UDULabel label="Email" />
      <TextInput
        style={styles.input}
        placeholder="Nhập email"
      />

      <UDULabel label="Mật khẩu" />
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        secureTextEntry
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
});

export default LoginScreen;
