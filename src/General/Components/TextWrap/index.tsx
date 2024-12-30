import React from 'react';
import { Text, ITextProps } from 'native-base';
import { StyleProp, TextStyle } from 'react-native';
import AppData from '@/General/Constants/AppData';

interface TextWrapperProps extends ITextProps {
  children: React.ReactNode,
  style?: StyleProp<TextStyle>, }


const TextWrapper: React.FC<TextWrapperProps> = ({ children, style, ...props }) => {
  return (
    <Text style={[{ fontFamily: AppData.fontFamily.regular }, style]} {...props}>
            {children}
        </Text>);

};

export default TextWrapper;