import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Bienvenue sur l'application de gestion de stock !
      </Animated.Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scan')}>
        <FontAwesome5 name="barcode" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Scanner un produit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Products')}>
        <FontAwesome5 name="box" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Voir les produits</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Statistics')}>
        <FontAwesome5 name="chart-bar" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Statistiques</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#00C8FF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'Roboto',
  },
  icon: {
    marginRight: 10,
  },
});

export default HomeScreen;