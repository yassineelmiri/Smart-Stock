import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setProducts } from '../redux/productSlice';
const ScanScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [barcodeData, setBarcodeData] = useState('');
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productSupplier, setProductSupplier] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productImage, setProductImage] = useState('');
    const [warehouse, setWarehouse] = useState('');
    const [city, setCity] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handleSubmit = async () => {
        if (!productName || !productPrice || !productSupplier || !warehouse || !city || !latitude || !longitude || !productQuantity) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs requis.');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name: productName,
            type: productType,
            barcode: barcodeData,
            price: parseFloat(productPrice),
            supplier: productSupplier,
            image: productImage || null,
            stocks: [
                {
                    id: Date.now() + 1,
                    name: warehouse,
                    quantity: parseInt(productQuantity),
                    localisation: {
                        city: city,
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                    },
                },
            ],
            editedBy: [
                {
                    warehousemanId: 1444,
                    at: new Date().toISOString().split('T')[0],
                },
            ],
        };

        try {
            const existingProducts = await AsyncStorage.getItem('products');
            let products = existingProducts ? JSON.parse(existingProducts) : [];
            products.push(newProduct);
            await AsyncStorage.setItem('products', JSON.stringify(products));
            dispatch(setProducts(products));

            Alert.alert('Succès', 'Produit ajouté avec succès!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erreur', 'Impossible d’enregistrer le produit.');
            console.error('Erreur AsyncStorage:', error);
        }
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Ajouter un produit</Text>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Code-barres"
                    value={barcodeData}
                    onChangeText={setBarcodeData}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nom du produit"
                    value={productName}
                    onChangeText={setProductName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Type du produit"
                    value={productType}
                    onChangeText={setProductType}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Prix"
                    keyboardType="numeric"
                    value={productPrice}
                    onChangeText={setProductPrice}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Fournisseur"
                    value={productSupplier}
                    onChangeText={setProductSupplier}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Quantité"
                    keyboardType="numeric"
                    value={productQuantity}
                    onChangeText={setProductQuantity}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Entrepôt"
                    value={warehouse}
                    onChangeText={setWarehouse}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ville"
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Latitude"
                    keyboardType="numeric"
                    value={latitude}
                    onChangeText={setLatitude}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitude"
                    keyboardType="numeric"
                    value={longitude}
                    onChangeText={setLongitude}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Image URL (facultatif)"
                    value={productImage}
                    onChangeText={setProductImage}
                />
                <Button title="Ajouter produit" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};

const COLORS = {
    background: '#f4f4f9',
    text: '#333',
    inputBackground: '#fff',
    inputBorder: '#ddd',
    buttonBackground: '#4CAF50',
    buttonText: '#fff',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 22,
        color: COLORS.text,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    input: {
        height: 45,
        borderColor: COLORS.inputBorder,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: COLORS.inputBackground,
        color: '#000',
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.buttonBackground,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.buttonText,
        fontSize: 18,
        textAlign: 'center',
    },
});

export default ScanScreen;
