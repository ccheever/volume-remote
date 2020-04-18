import React, { useState, useEffect } from 'react';
import { Slider, StyleSheet, Switch, Text, View } from 'react-native';
import useInterval from 'use-interval';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

async function getState() {
  return null;
  return result?.data;
}

let client = new ApolloClient({
  uri: 'http://192.168.1.221:10200/graphql',
});

export function App() {
  let [setRemoteVolume, { setRemoteVolumeData }] = useMutation(gql`
    mutation SetVolume($level: Int!) {
      setVolume(level: $level)
    }
  `);

  let [setRemoteMuted, { setRemoteMutedData }] = useMutation(gql`
    mutation SetMuted($muted: Boolean!) {
      setMuted(muted: $muted)
    }
  `);

  let getRemoteStateQuery = useQuery(
    gql`
      query GetState {
        volume
        muted
      }
    `,
    {
      pollInterval: 500,
    }
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getRemoteStateQuery?.data?.muted ? '#cccccc' : '#ffcc00',
        },
      ]}>
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center',
          justifyContent: 'space-around',
        }}>
        <View>
          <Slider
            value={getRemoteStateQuery?.data?.volume}
            maximumValue={100}
            style={{
              transform: [{ scaleX: 2.0 }, { scaleY: 2.0 }],
              width: 150,
            }}
            onValueChange={async (value) => {
              let { data } = await setRemoteVolume({ variables: { level: Math.ceil(value) } });
              await getRemoteStateQuery.refetch();
            }}
          />
        </View>
        <View
          style={{
            width: 100,
            alignItems: 'center',
          }}>
          <Switch
            // trackColor={{ false: "#767577", true: "#81b0ff" }}
            // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            // ios_backgroundColor="#3e3e3e"
            style={{
              transform: [{ scaleX: 2.5 }, { scaleY: 2.5 }],
            }}
            onValueChange={async (value) => {
              let { data } = await setRemoteMuted({ variables: { muted: !!value } });
              await getRemoteStateQuery.refetch();
            }}
            value={getRemoteStateQuery?.data?.muted}
          />
        </View>
      </View>
    </View>
  );
}

export default (props) => (
  <ApolloProvider client={client}>
    <App {...props} />
  </ApolloProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
