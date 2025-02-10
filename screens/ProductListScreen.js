import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setProducts } from '../redux/productSlice';
import * as Print from 'expo-print'; // 📄 Importation d'expo-print
import { shareAsync } from 'expo-sharing'; // 📤 Pour partager le fichier

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.list);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const loadProductsFromStorage = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem('products');
        if (storedProducts) {
          dispatch(setProducts(JSON.parse(storedProducts)));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits depuis AsyncStorage:", error);
      }
    };

    loadProductsFromStorage();

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.8.211:5000/products');
        dispatch(setProducts(response.data));
        await AsyncStorage.setItem('products', JSON.stringify(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        setLoading(false);
      }
    };

    if (products.length === 0) {
      fetchProducts();
    }
  }, [dispatch, products]);

  const updateProductQuantity = async (productId, change) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        const updatedStocks = product.stocks.map(stock => {
          if (stock.id === product.stocks[0].id) {
            stock.quantity += change;
          }
          return stock;
        });
        product.stocks = updatedStocks;
      }
      return product;
    });

    dispatch(setProducts(updatedProducts));
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des produits...</Text>
      </View>
    );
  }

  const getStockColor = (quantity) => {
    if (quantity === 0) return 'red';
    if (quantity < 10) return 'yellow';
    return 'green';
  };

  // 📄 Fonction pour générer le PDF
  const generatePDF = async () => {
    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #333; }
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
              <td>${product.stocks[0]?.quantity ?? 0}</td>
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
      <Button title="Exporter PDF" onPress={generatePDF} /> {/* 📄 Bouton d'exportation */}
      <FlatList
        data={products}
        renderItem={({ item }) => {
          const product = item;
          const stock = product.stocks[0];
          const quantity = stock ? stock.quantity : 0;

          return (
            <View style={styles.productContainer}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={styles.productText}>Nom : {product.name}</Text>
              <Text style={styles.productText}>Prix : {product.price}€</Text>
              <Text style={[styles.productText, { color: getStockColor(quantity) }]}>
                Quantité : {quantity}
              </Text>
              <View style={styles.buttonContainer}>
                <Button title="Réapprovisionner" onPress={() => updateProductQuantity(product.id, 1)} />
                <Button title="Décharger" onPress={() => updateProductQuantity(product.id, -1)} />
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
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
  },
  productText: {
    fontSize: 18,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default ProductListScreen;
