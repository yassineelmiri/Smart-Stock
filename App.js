import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "./redux/authSlice";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import ScanScreen from "./screens/ScanScreen";
import ProductListScreen from "./screens/ProductListScreen";
import StatisticsScreen from "./screens/StatisticsScreen";
import DetailScreen from "./screens/DetailScreen";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#00C8FF" },
        headerTintColor: "white",
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerStyle: { backgroundColor: "#00C8FF" }, headerTintColor: "white" }}
        />
      ) : (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
            name="Scan" 
            component={ScanScreen} 
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
            name="Statistics" 
            component={StatisticsScreen} 
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
           <Stack.Screen 
            name="Detail" 
            component={DetailScreen} 
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
            name="Products" 
            component={ProductListScreen} 
            options={{
              headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
                  <Ionicons name="log-out-outline" size={24} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
