import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setProducts } from '../redux/productSlice';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.list);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Charger les produits stockés localement
        const storedProducts = await AsyncStorage.getItem('products');
        if (storedProducts) {
          dispatch(setProducts(JSON.parse(storedProducts)));
        }

        // Charger les produits depuis l'API
        const response = await axios.get('http://192.168.1.14:5000/products');
        dispatch(setProducts(response.data));

        // Sauvegarder les produits en local
        await AsyncStorage.setItem('products', JSON.stringify(response.data));
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [dispatch]);

  const updateProductQuantity = async (productId, change) => {
    const updatedProducts = products.map(product => {
      if (product._id === productId) {
        const updatedStocks = product.stocks?.map(stock => ({
          ...stock,
          quantity: stock.quantity + change
        })) || [];

        return { ...product, stocks: updatedStocks };
      }
      return product;
    });

    dispatch(setProducts(updatedProducts));
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text style={{ color: '#fff' }}>Chargement des produits...</Text>
      </View>
    );
  }

  const getStockColor = (quantity) => {
    if (quantity === 0) return 'red';
    if (quantity < 10) return 'yellow';
    return 'green';
  };

  const generatePDF = async () => {
    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Rapport des Produits</h1>
        <table>
          <tr>
            <th>Nom</th>
            <th>Prix (€)</th>
            <th>Quantité</th>
          </tr>
          ${products.map(product => `
            <tr>
              <td>${product.name}</td>
              <td>${product.price}</td>
              <td>${product.stocks?.[0]?.quantity ?? 0}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Exporter le PDF' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Produits :</Text>
      <Button title="Exporter PDF" onPress={generatePDF} />
      <FlatList
        data={products}
        renderItem={({ item }) => {
          const quantity = item.stocks?.[0]?.quantity ?? 0;
          return (
            <View style={styles.productContainer}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productText}>Nom : {item.name}</Text>
              <Text style={styles.productText}>Prix : {item.price}€</Text>
              <Text style={[styles.productText, { color: getStockColor(quantity) }]}>
                Quantité : {quantity}
              </Text>
              <View style={styles.buttonContainer}>
                <Button title="Réapprovisionner" onPress={() => updateProductQuantity(item._id, 1)} />
                <Button title="Décharger" onPress={() => updateProductQuantity(item._id, -1)} />
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: '#fff',
  },
  productContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  productText: {
    fontSize: 18,
    color: '#fff',
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default ProductListScreen;
