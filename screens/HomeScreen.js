import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  return (
    <ImageBackground 
      source={require('../assets/bg.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
          Bienvenu sur l'application de gestion de stock !
        </Animated.Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.buttonText}>Scanner un produit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.buttonText}>Voir les produits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.buttonText}>Statistiques</Text>
        </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: 'rgb(0, 0, 0)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;