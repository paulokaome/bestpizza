import React, { useEffect, useState, useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import happyEmoji from "@assets/happy.png";
import { Alert, TouchableOpacity, FlatList } from "react-native";
import { useTheme } from "styled-components";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { Search } from "@components/Search";
import { ProductCard, ProductProps } from "@components/ProductCard";

import {
  Container,
  Header,
  Greeting,
  GreetingEmoji,
  GreetingText,
  MenuTitle,
  MenuHeader,
  MenuItensNumber,
  NewProductButton,
} from "./styles";

export function Home() {
  const { COLORS } = useTheme();
  const navigation = useNavigation();
  const [pizzas, setPizzas] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState("");

  function fetchPizzas(value: string) {
    const formattedValue = value.toLocaleLowerCase().trim();

    firestore()
      .collection("pizzas")
      .orderBy("name_insensitive")
      .startAt(formattedValue)
      .endAt(`${formattedValue}\uf8ff`)
      .get()
      .then((response) => {
        const data = response.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ProductProps[];
        console.log(data);

        setPizzas(data);
      })
      .catch(() =>
        Alert.alert("Consulta", "Não foi possível realizar a consulta")
      );
  }

  function handleSearch() {
    fetchPizzas(search);
  }

  function handleSearchClear() {
    setSearch("");
    fetchPizzas("");
  }

  function handleAdd() {
    navigation.navigate("product", {});
  }

  function handleOpen(id: string) {
    navigation.navigate("product", { id });
  }

  useFocusEffect(
    useCallback(() => {
      fetchPizzas("");
    }, [])
  );

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji} />
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>
        <TouchableOpacity>
          <MaterialIcons name="logout" size={24} color={COLORS.TITLE} />
        </TouchableOpacity>
      </Header>
      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />
      <MenuHeader>
        <MenuTitle>Cardápio</MenuTitle>
        <MenuItensNumber>{pizzas.length} pizzas</MenuItensNumber>
      </MenuHeader>
      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
      />

      <NewProductButton
        title="Cadastrar Pizza"
        type="secondary"
        onPress={handleAdd}
      />
    </Container>
  );
}
