import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setProducts } from '../redux/productSlice';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.list);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      const localProducts = storedProducts ? JSON.parse(storedProducts) : [];

      const response = await axios.get('http://192.168.11.103:5000/products');
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <ActivityIndicator size="large" color="#00C8FF" />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    );
  }

  const getStockColor = (quantity) => {
    if (quantity === 0) return '#FF4444'; // Rouge
    if (quantity < 10) return '#FFD700'; // Jaune
    return '#00C8FF'; // Bleu
  };

  const generatePDF = async () => {
    const html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #F5F5F5; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; color: #333; }
          th { background-color: #00C8FF; color: #fff; }
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
      <Text style={styles.title}>Liste des Produits</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit..."
        placeholderTextColor="#B0B0B0"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => {
          const quantity = item.stocks?.[0]?.quantity ?? 0;
          return (
            <View style={styles.productContainer}>
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => deleteProduct(item.id)}
              >
                <FontAwesome name="times" size={24} color="#FF4444" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Detail', { product: item })}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
              </TouchableOpacity>

              <Text style={styles.productText}>Nom : {item.name}</Text>
              <Text style={styles.productText}>Type : {item.type}</Text>
              <Text style={styles.productPrice}>Prix : {item.price}💰</Text>
              <Text style={[styles.productText, { color: getStockColor(quantity) }]}>
                Quantité : {quantity}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#00C8FF' }]}
                  onPress={() => updateProductQuantity(item.id, 1)}
                >
                  <Text style={styles.actionButtonText}>Réapprovisio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FF4444' }]}
                  onPress={() => updateProductQuantity(item.id, -1)}
                >
                  <Text style={styles.actionButtonText}>Décharger</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
        <Text style={styles.pdfButtonText}>Exporter PDF</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: '#333',
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  productContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00C8FF',
    marginBottom: 10,
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
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  loadingText: {
    color: '#333',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  pdfButton: {
    backgroundColor: '#00C8FF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  pdfButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductListScreen;