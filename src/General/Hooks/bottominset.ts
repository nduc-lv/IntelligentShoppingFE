import React from 'react';
import {
  EmitterSubscription,
  Keyboard,
  KeyboardEvent,
  Platform
} from 'react-native';

const useKeyboardBottomInset = () => {
  const [bottom, setBottom] = React.useState(0);
  const subscriptions = React.useRef<EmitterSubscription[]>([]);

  React.useEffect(() => {
    subscriptions.current = [
      Keyboard.addListener('keyboardDidHide', (e) => setBottom(0)),
      Keyboard.addListener('keyboardDidShow', (e: KeyboardEvent) => {
        if (Platform.OS === 'android') {
          setBottom(e.endCoordinates.height);
        } else {
          setBottom(
            Math.max(e.startCoordinates?.height || 0, e.endCoordinates.height)
          );
        }
      })
    ];

    return () => {
      subscriptions.current.forEach((subscription) => {
        subscription.remove();
      });
    };
  }, [setBottom, subscriptions]);

  return bottom;
};

export default useKeyboardBottomInset;