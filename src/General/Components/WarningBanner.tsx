import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const WarningBanner = (props: { description: string, hidden: boolean, }) => {
  const safeAreaInsets = useSafeAreaInsets();
  const [slideAnim] = useState(new Animated.Value(-1000)); // Initial position off-screen

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: props.hidden ? -1000 : 0, // Slide out if hidden, slide in if not
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [props.hidden]);

  return (
    <Animated.View
      style={[
      styles.banner,
      {
        transform: [{ translateY: slideAnim }],
        paddingTop: safeAreaInsets.top,
        marginBottom: safeAreaInsets.bottom,
        paddingBottom: 5,
        paddingLeft: safeAreaInsets.left + 20,
        paddingRight: safeAreaInsets.right + 20
      }]
      }>

      <Text style={styles.text}>{props.description}</Text>
    </Animated.View>);

};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF4500',
    zIndex: 1000
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default WarningBanner;