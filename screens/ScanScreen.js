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
    const [scanned, setScanned] = useState(false);

    const [cameraPermission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        (async () => {
            if (cameraPermission?.status === 'granted') {
                setHasPermission(true);
            } else if (cameraPermission?.status === 'denied') {
                Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la caméra pour scanner un QR code.');
                setHasPermission(false);
            } else {
                const { status } = await requestPermission();
                setHasPermission(status === 'granted');
            }
        })();
    }, [cameraPermission]);

    const handleBarcodeScan = (barcode) => {
        console.log("QR Code scanné:", barcode);
        if (!barcode) {
            Alert.alert('Erreur', 'Aucun code-barres détecté.');
            return;
        }
        console.log("QR Code scanné:", barcode);
        setBarcodeData(barcode);
        setIsCameraVisible(false);
    };

    const handleSubmit = async () => {
        if (!productName || !productPrice || !productSupplier || !warehouse || !city || !latitude || !longitude || !productQuantity) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs requis.');
            return;
        }

        if (isNaN(parseInt(productQuantity))) {
            Alert.alert('Erreur', 'La quantité doit être un nombre entier.');
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

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setBarcodeData(data);
        setIsCameraVisible(false);
        Alert.alert(`Barcode scanned! Data: ${data}`);
    };

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Ajouter un produit</Text>
            <View style={styles.formContainer}>
                <View style={styles.row}>
                    <TextInput style={styles.input} placeholder="Code-barres" value={barcodeData} onChangeText={setBarcodeData} placeholderTextColor="#B0B0B0" />
                    <TouchableOpacity style={styles.scanButtonContainer} onPress={() => setIsCameraVisible(true)}>
                        <Text style={styles.scanButtonText}>Scanner QR</Text>
                    </TouchableOpacity>
                </View>
                {isCameraVisible && hasPermission === true && (
                    <View>
                        <Text style={styles.scanningText}>Scan en cours...</Text>
                        <CameraView
                            type={CameraType}
                            style={styles.camera}
                            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                            ref={(ref) => setCamera(ref)}
                        />
                        <Button title="Fermer la caméra" onPress={() => setIsCameraVisible(false)} />
                    </View>
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

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Ajouter produit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 28,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
    },
    formContainer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
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
        borderColor: '#DDD',
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#FAFAFA',
        color: '#333',
        fontSize: 16,
    },
    scanButtonContainer: {
        backgroundColor: '#00C8FF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    camera: {
        flex: 1,
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginTop: 10,
    },
    scanningText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#00C8FF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ScanScreen;