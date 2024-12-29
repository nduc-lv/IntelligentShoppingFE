import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const Card = ({ image, title,children }:{image?:string,title?:string,children?:any}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    overflow: 'hidden', // Ensures rounded corners for child elements
    margin: 10,
    flex:1
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign:"center"
  },
});

export default Card;
