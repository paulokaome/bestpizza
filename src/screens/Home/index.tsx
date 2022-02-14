import React, { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import happyEmoji from "@assets/happy.png";
import { Alert, TouchableOpacity } from "react-native";
import { useTheme } from "styled-components";
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
} from "./styles";

export function Home() {
  const { COLORS } = useTheme();

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
      })
      .catch(() =>
        Alert.alert("Consulta", "Não foi possível realizar a consulta")
      );
  }

  useEffect(() => {
    fetchPizzas("");
  }, []);

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
      <Search onSearch={() => {}} onClear={() => {}} />
      <MenuHeader>
        <MenuTitle>Cardápio</MenuTitle>
        <MenuItensNumber>33 pizzas</MenuItensNumber>
      </MenuHeader>
      <ProductCard
        data={{
          id: "1",
          name: "Pizza",
          description: "lorem lorem lorem lorem lorem",
          photo_url: "https://github.com/paulokaome.png",
        }}
      />
    </Container>
  );
}
