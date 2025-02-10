import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setProducts } from '../redux/productSlice';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Import useNavigation
import { FontAwesome } from '@expo/vector-icons';

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Initialize navigation

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

      const response = await axios.get('http://192.168.11.119:5000/products');
      const apiProducts = response.data;

      const allProducts = [...localProducts, ...apiProducts];
      const uniqueProducts = allProducts.reduce((acc, product) => {
        if (!acc.some((p) => p.id === product.id)) {
          acc.push(product);
        }
        return acc;
      }, []);

      dispatch(setProducts(uniqueProducts));
      await AsyncStorage.setItem('products', JSON.stringify(uniqueProducts));
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const updateProductQuantity = async (productId, change) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const updatedStocks = product.stocks?.map((stock) => ({
          ...stock,
          quantity: stock.quantity + change,
        })) || [];

        return { ...product, stocks: updatedStocks };
      }
      return product;
    });

    dispatch(setProducts(updatedProducts));
    await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = async (productId) => {
    try {
      const updatedProducts = products.filter((product) => product.id !== productId);
      dispatch(setProducts(updatedProducts));
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
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
          ${products
            .map(
              (product) => `
            <tr>
              <td>${product.name}</td>
              <td>${product.price}</td>
              <td>${product.stocks?.[0]?.quantity ?? 0}</td>
            </tr>
          `
            )
            .join('')}
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
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => deleteProduct(item.id)}
              >
                <FontAwesome name="times" size={24} color="red" />
              </TouchableOpacity>

              {/* Wrap the Image in a TouchableOpacity for navigation */}
              <TouchableOpacity onPress={() => navigation.navigate('Detail', { product: item })}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
              </TouchableOpacity>

              <Text style={styles.productText}>Nom : {item.name}</Text>
              <Text style={styles.productText}>Prix : {item.price}€</Text>
              <Text style={[styles.productText, { color: getStockColor(quantity) }]}>
                Quantité : {quantity}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Réapprovisionner"
                  onPress={() => updateProductQuantity(item.id, 1)}
                />
                <Button
                  title="Décharger"
                  onPress={() => updateProductQuantity(item.id, -1)}
                />
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
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
    position: 'relative',
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
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default ProductListScreen;