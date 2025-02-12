import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setProducts } from '../redux/productSlice';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

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
    const [hasPermission, setHasPermission] = useState(null);
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [camera, setCamera] = useState(null);

    const [cameraPermission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (cameraPermission?.status === 'granted') {
            setHasPermission(true);
        } else {
            setHasPermission(false);
            requestPermission();
        }
    }, [cameraPermission]);

    const handleBarcodeScan = (barcode) => {
        setBarcodeData(barcode);
        console.log("QR Code scanné:", barcode);
        setIsCameraVisible(false); 
    };

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
                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Code-barres" value={barcodeData} onChangeText={setBarcodeData} placeholderTextColor="#B0B0B0" />
                    <TouchableOpacity onPress={() => setIsCameraVisible(true)}>
                        <Text style={styles.scanButton}>Scanner QR</Text>
                    </TouchableOpacity>
                </View>
                {isCameraVisible && hasPermission === true && (
                    <CameraView
                        style={styles.camera}
é                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                            onBarcodeScanned: (scanResult) => handleBarcodeScan(scanResult.data),
                        }}
                    />
                )}

                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Nom Pro." value={productName} onChangeText={setProductName} placeholderTextColor="#B0B0B0" />
                    <TextInput style={styles.input} placeholder="Type" value={productType} onChangeText={setProductType} placeholderTextColor="#B0B0B0" />
                </View>

                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Prix" keyboardType="numeric" value={productPrice} onChangeText={setProductPrice} placeholderTextColor="#B0B0B0" />
                    <TextInput style={styles.input} placeholder="Fournisseur" value={productSupplier} onChangeText={setProductSupplier} placeholderTextColor="#B0B0B0" />
                </View>

                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Quantité" keyboardType="numeric" value={productQuantity} onChangeText={setProductQuantity} placeholderTextColor="#B0B0B0" />
                    <TextInput style={styles.input} placeholder="Entrepôt" value={warehouse} onChangeText={setWarehouse} placeholderTextColor="#B0B0B0" />
                </View>

                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Ville" value={city} onChangeText={setCity} placeholderTextColor="#B0B0B0" />
                    <TextInput style={styles.input} placeholder="Latitude" keyboardType="numeric" value={latitude} onChangeText={setLatitude} placeholderTextColor="#B0B0B0" />
                </View>

                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Longitude" keyboardType="numeric" value={longitude} onChangeText={setLongitude} placeholderTextColor="#B0B0B0" />
                    <TextInput style={styles.input} placeholder="Image URL" value={productImage} onChangeText={setProductImage} placeholderTextColor="#B0B0B0" />
                </View>

                <Button title="Ajouter produit" onPress={handleSubmit} color="#000" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
    },
    formContainer: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 12,
        marginVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#444',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#2A2A2A',
        color: '#fff',
        fontSize: 16,
    },
    scanButton: {
        color: '#00C8FF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#00C8FF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});


export default ScanScreen;
