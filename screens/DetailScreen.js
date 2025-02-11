import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailScreen = ({ route, navigation }) => {
  const { product } = route.params; 
  const [modalVisible, setModalVisible] = useState(false); 
  const [updatedProduct, setUpdatedProduct] = useState(product); 

  // Function to handle updating product information
  const handleUpdateProduct = async () => {
    try {
      // Fetch existing products from AsyncStorage
      const storedProducts = await AsyncStorage.getItem('products');
      let products = storedProducts ? JSON.parse(storedProducts) : [];

      // Find the index of the product to update
      const productIndex = products.findIndex((p) => p.id === updatedProduct.id);

      if (productIndex !== -1) {
        // Update the product in the array
        products[productIndex] = updatedProduct;

        // Save the updated products array to AsyncStorage
        await AsyncStorage.setItem('products', JSON.stringify(products));

        // Close the modal
        setModalVisible(false);

        // Navigate back to the product list or refresh the screen
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image source={{ uri: updatedProduct.image }} style={styles.productImage} />

      {/* Product Details */}
      <Text style={styles.title}>{updatedProduct.name}</Text>
      <Text style={styles.detailText}>Type: {updatedProduct.type}</Text>
      <Text style={styles.detailText}>Prix: {updatedProduct.price}€</Text>
      <Text style={styles.detailText}>Code-barres: {updatedProduct.barcode}</Text>
      <Text style={styles.detailText}>Fournisseur: {updatedProduct.supplier}</Text>
      <Text style={styles.detailText}>Solde: {updatedProduct.solde}€</Text>

      {/* Stocks Section */}
      <Text style={styles.sectionTitle}>Stocks:</Text>
      {updatedProduct.stocks.map((stock, index) => (
        <View key={index} style={styles.stockContainer}>
          <Text style={styles.stockText}>Nom: {stock.name}</Text>
          <Text style={styles.stockText}>Quantité: {stock.quantity}</Text>
          <Text style={styles.stockText}>
            Localisation: {stock.localisation.city} ({stock.localisation.latitude}, {stock.localisation.longitude})
          </Text>
        </View>
      ))}

      {/* Edited By Section */}
      <Text style={styles.sectionTitle}>Édité par:</Text>
      {updatedProduct.editedBy.map((edit, index) => (
        <View key={index} style={styles.editContainer}>
          <Text style={styles.editText}>Warehouseman ID: {edit.warehousemanId}</Text>
          <Text style={styles.editText}>Date: {edit.at}</Text>
        </View>
      ))}

      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.updateButtonText}>Modifier le produit</Text>
      </TouchableOpacity>

      {/* Update Product Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le produit</Text>

            {/* Input Fields for Updating Product */}
            <TextInput
              style={styles.input}
              placeholder="Nom du produit"
              value={updatedProduct.name}
              onChangeText={(text) =>
                setUpdatedProduct({ ...updatedProduct, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Type du produit"
              value={updatedProduct.type}
              onChangeText={(text) =>
                setUpdatedProduct({ ...updatedProduct, type: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Prix"
              keyboardType="numeric"
              value={updatedProduct.price}
              onChangeText={(text) =>
                setUpdatedProduct({ ...updatedProduct, price: parseFloat(text) || 0 })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Code-barres"
              value={updatedProduct.barcode}
              onChangeText={(text) =>
                setUpdatedProduct({ ...updatedProduct, barcode: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Fournisseur"
              value={updatedProduct.supplier}
              onChangeText={(text) =>
                setUpdatedProduct({ ...updatedProduct, supplier: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Solde"
              keyboardType="numeric"
              value={updatedProduct.solde}
              onChangeText={(text) =>
                setUpdatedProduct({ ...updatedProduct, solde: parseFloat(text) || 0 })
              }
            />

            {/* Update and Cancel Buttons */}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateProduct}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  stockContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  stockText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  editContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  editText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 40,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailScreen;