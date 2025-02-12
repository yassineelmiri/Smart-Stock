import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";

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
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
            />

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Image
                        source={require('../assets/lock-icon.png')}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        placeholder="Secret Key"
                        value={secretKey}
                        onChangeText={setSecretKey}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#B0B0B0"
                    />
                </View>

                {loading && <ActivityIndicator size="large" color="#00C8FF" />}
                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    formContainer: {
        width: "90%",
        backgroundColor: "#FFF",
        padding: 20,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#DDD",
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    inputIcon: {
        width: 24,
        height: 24,
        tintColor: "#00C8FF",
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: "#333",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#00C8FF",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
});

export default LoginScreen;