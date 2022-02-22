import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import { useTheme } from "styled-components/native";
import firestore from "@react-native-firebase/firestore";

import { Home } from "@screens/Home";
import { Orders } from "@screens/Orders";
import { Product } from "@screens/Product";

import { BottomMenu } from "@components/BottomMenu";
import { useAuth } from "@hooks/auth";

const { Navigator, Screen } = createBottomTabNavigator();

export function UserTabRoutes() {
  const { COLORS } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState("0");

  useEffect(() => {
    const subscribe = firestore()
      .collection("orders")
      .where("status", "==", "Pronto")
      .onSnapshot((querySnapshot) => {
        setNotifications(String(querySnapshot.docs.length));
      });
    return () => subscribe();
  }, []);

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cárdapio" color={color} />
          ),
        }}
      />
      {user?.isAdmin && (
        <Screen
          name="product"
          component={Product}
          initialParams={{ id: null }}
          options={{
            tabBarIcon: ({ color }) => (
              <BottomMenu title="Cadastrar Pizza" color={color} />
            ),
          }}
        />
      )}
      <Screen
        name="orders"
        component={Orders}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu
              title="Pedidos"
              color={color}
              notifications={notifications}
            />
          ),
        }}
      />
    </Navigator>
  );
}
