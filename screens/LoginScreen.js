import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { View, Text, TextInput, Button, ActivityIndicator, ImageBackground, TouchableOpacity } from "react-native";

const LoginScreen = ({ navigation }) => {
    const [secretKey, setSecretKey] = useState("");
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    const handleLogin = () => {
        
        dispatch(loginUser({ secretKey }));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }]
            });
        }
    }, [isAuthenticated, navigation]);

    return (
        <ImageBackground
            source={require('../assets/login.png')}
            style={{ flex: 1 }}
        >
            <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
                <Text style={{ fontSize: 24, marginBottom: 20, color: 'white' }}>Connexion</Text>
                <TextInput
                    placeholder="Secret Key"
                    value={secretKey}
                    onChangeText={setSecretKey}
                    secureTextEntry
                    style={{
                        borderWidth: 1,
                        padding: 12,
                        marginBottom: 20,
                        borderColor: '#fff',
                        color: '#fff',
                        backgroundColor: '#444',
                        borderRadius: 8,
                    }}
                    placeholderTextColor="#ccc"
                />
                
                {loading && <ActivityIndicator size="large" color="#fff" />}
                {error && <Text style={{ color: "red" }}>{error}</Text>}

                <TouchableOpacity 
                    style={{
                        backgroundColor: '#000',
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                    onPress={handleLogin}
                >
                    <Text style={{ color: '#fff', fontSize: 16 }}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default LoginScreen;
