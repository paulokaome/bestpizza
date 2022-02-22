import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "@screens/Home";
import { Product } from "@screens/Product";
import { Order } from "@screens/Order";
import { useAuth } from "@hooks/auth";

import { UserTabRoutes } from "./user.tabs.routes";

const { Navigator, Screen, Group } = createNativeStackNavigator();

export function UserStackRoutes() {
  const { user } = useAuth();

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {user?.isAdmin ? (
        <Group>
          {/* <Screen name="home" component={Home} /> */}
          {/* <Screen name="product" component={Product} /> */}
           <Screen name="UserTabsRoute" component={UserTabRoutes} />
        </Group>
      ) : (
        <Group>
          <Screen name="UserTabsRoute" component={UserTabRoutes} />
          <Screen name="order" component={Order} />
        </Group>
      )}
    </Navigator>
  );
}
