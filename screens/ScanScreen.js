import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanScreen = ({ navigation }) => {
    const [scanned, setScanned] = useState(false);
    const [data, setData] = useState('');
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productSupplier, setProductSupplier] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productImage, setProductImage] = useState('');
    const [warehouse, setWarehouse] = useState('');

    // Demande des permissions pour la caméra
    const [cameraPermission, requestPermission] = useCameraPermissions();

    // Handler pour scanner le code QR
    const handleBarCodeScanned = async ({ type, data }) => {
        console.log('Code QR scanné:', data); 
        setScanned(true);
        setData(data);

        try {
            const response = await fetch(`http://192.168.8.211:5000/products?barcode=1234567890123`);
            const product = await response.json();

            if (product.length > 0) {
                const productData = product[0];
                setProductName(productData.name);
                setProductType(productData.type);
                setProductPrice(productData.price.toString());
                setProductSupplier(productData.supplier);
                setProductQuantity(productData.stocks[0]?.quantity.toString());
                setProductImage(productData.image);
              } else {
                alert('Produit non trouvé');
              }
        } catch (error) {
            console.error('Erreur lors de la récupération du produit:', error);
        }
    };

    // Envoi des données du produit
    const handleSubmit = () => {
        const product = {
            name: productName,
            type: productType,
            price: productPrice,
            supplier: productSupplier,
            quantity: productQuantity,
            image: productImage,
            warehouse,
        };

        AsyncStorage.setItem('newProduct', JSON.stringify(product));
        alert('Produit ajouté avec succès!');
        navigation.goBack();
    };

    useEffect(() => {
        if (cameraPermission?.status !== 'granted') {
            requestPermission();
        }
    }, [cameraPermission, requestPermission]);

    if (cameraPermission === null) {
        return <View><Text>Demande de permission en cours...</Text></View>;
    }

    if (cameraPermission.status === 'denied') {
        return <View><Text>Permission de caméra refusée</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Scanner un produit</Text>

            {/* Affichage de la caméra avec CameraView */}
            <CameraView
                style={styles.camera}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                type='back'
                barCodeScannerSettings={{
                    barCodeTypes: ['qr', 'ean13'],
                }}
            />

            {scanned && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Code Scanné : {data}</Text>
                    <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
                </View>
            )}

            {/* Formulaire de création de produit */}
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Formulaire de création de produit</Text>
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
                    placeholder="Prix du produit"
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
                    placeholder="Quantité initiale"
                    keyboardType="numeric"
                    value={productQuantity}
                    onChangeText={setProductQuantity}
                />
                {parseInt(productQuantity) > 0 && (
                    <TextInput
                        style={styles.input}
                        placeholder="Entrepôt concerné"
                        value={warehouse}
                        onChangeText={setWarehouse}
                    />
                )}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 10,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    camera: {
        width: '100%',
        height: 400,
        marginBottom: 20,
    },
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#fff',
    },
    formContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    formTitle: {
        fontSize: 18,
        marginBottom: 15,
        color: '#fff',
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
});

export default ScanScreen;
