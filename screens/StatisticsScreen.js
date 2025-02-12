import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.11.103:5000/products';

const StatisticsScreen = () => {
  const [products, setProducts] = useState([]);
  const [totalCities, setTotalCities] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Récupérer les produits de AsyncStorage
        const storedProducts = await AsyncStorage.getItem('products');
        const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

        // Récupérer les produits depuis l'API
        const response = await fetch(API_URL);
        const apiProducts = await response.json();

        // Fusionner les listes tout en évitant les doublons
        const allProducts = [...localProducts, ...apiProducts];
        const uniqueProducts = allProducts.reduce((acc, product) => {
          if (!acc.some((p) => p.id === product.id)) {
            acc.push(product);
          }
          return acc;
        }, []);

        setProducts(uniqueProducts);
        calculateStatistics(uniqueProducts);
      } catch (error) {
        console.error('Erreur de chargement des produits:', error);
      }
    };

    fetchProducts();
  }, []);

  const calculateStatistics = (data) => {
    const allCities = new Set();
    let outOfStock = 0;
    let totalValue = 0;

    data.forEach((product) => {
      if (product.stocks.length === 0) {
        outOfStock++;
      }
      product.stocks.forEach((stock) => {
        allCities.add(stock.localisation.city);
        totalValue += stock.quantity * product.price;
      });
    });

    setTotalCities(allCities.size);
    setOutOfStockCount(outOfStock);
    setTotalStockValue(totalValue);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productType}>{item.type}</Text>
        <Text style={styles.productPrice}>💰 {item.price} MAD</Text>
        <Text style={styles.stockTitle}>📍 Stock :</Text>
        {item.stocks.length > 0 ? (
          item.stocks.map((stock) => (
            <Text key={stock.id} style={styles.stockInfo}>
              - {stock.localisation.city}: {stock.quantity} unités
            </Text>
          ))
        ) : (
          <Text style={styles.outOfStock}>🚨 En rupture de stock</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Statistiques</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📦</Text>
          <Text style={styles.statTitle}>Produits</Text>
          <Text style={styles.statValue}>{products.length}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🏙️</Text>
          <Text style={styles.statTitle}>Villes</Text>
          <Text style={styles.statValue}>{totalCities}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚠️</Text>
          <Text style={styles.statTitle}>Rupture</Text>
          <Text style={styles.statValue}>{outOfStockCount}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statTitle}>Valeur</Text>
          <Text style={styles.statValue}>{totalStockValue} MAD</Text>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 5,
    color: '#00C8FF',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productType: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00C8FF',
    marginTop: 5,
    textAlign: 'center',
  },
  stockTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  stockInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  outOfStock: {
    fontSize: 14,
    color: '#FF6347',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StatisticsScreen;