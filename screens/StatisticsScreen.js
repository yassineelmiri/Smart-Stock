import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const API_URL = 'http://192.168.1.14:5000/products';

const StatisticsScreen = () => {
  const [products, setProducts] = useState([]);
  const [totalCities, setTotalCities] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        calculateStatistics(data);
      })
      .catch((error) => console.error('Erreur de chargement des produits:', error));
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
    <LinearGradient colors={['#121212', '#1E1E1E']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>📊 Statistiques et résumé des stocks</Text>

        <View style={styles.statBox}>
          <Text style={styles.statText}>📦 Nombre total de produits: {products.length}</Text>
          <Text style={styles.statText}>🏙️ Nombre total de villes: {totalCities}</Text>
          <Text style={styles.statText}>⚠️ Produits en rupture de stock: {outOfStockCount}</Text>
          <Text style={styles.statText}>💰 Valeur totale des stocks: {totalStockValue} MAD</Text>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2} // ✅ Affichage sous forme de grille (2 colonnes)
          columnWrapperStyle={styles.row} // ✅ Espacement entre les colonnes
          contentContainerStyle={styles.listContainer} // ✅ Meilleur espacement
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
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
    color: '#fff',
    textAlign: 'center',
  },
  productType: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 5,
    textAlign: 'center',
  },
  stockTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  stockInfo: {
    fontSize: 14,
    color: '#ccc',
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
