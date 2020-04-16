import React, { useState } from 'react';
import { Slider, StyleSheet, Switch, Text, View } from 'react-native';
import { createClient } from 'urql';

let urqlClient = createClient({
  url: `http://192.168.86.45:10200/graphql`,
});

export default function App() {
  let [volume, setVolume] = useState(0);
  let [muted, setMuted] = useState(false);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>

      <Slider
        value={volume}
        maximumValue={100}
        style={{
          width: 300,
        }}
        onValueChange={(value) => setVolume(value)}
      />

      <Text>{volume}</Text>

      <Switch
        // trackColor={{ false: "#767577", true: "#81b0ff" }}
        // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        // ios_backgroundColor="#3e3e3e"
        onValueChange={(value) => {
          console.log(value);
          setMuted(value);
        }}
        value={muted}
      />
      <Text>{`${muted}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
