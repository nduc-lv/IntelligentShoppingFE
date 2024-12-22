import React, { useEffect, useState } from 'react';
import {Text, StyleSheet, Animated } from 'react-native';

const WarningBanner = (props:{description:string,hidden:boolean}) => {
  const [slideAnim] = useState(new Animated.Value(-50)); // Initial position off-screen
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: !props.hidden ? -50 : 0, // Slide out if connected, slide in if not
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [!props.hidden]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.text}>{props.description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF4500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default WarningBanner;
