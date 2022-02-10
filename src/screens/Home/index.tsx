import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import happyEmoji from "@assets/happy.png";
import { TouchableOpacity } from "react-native";
import { useTheme } from "styled-components";

import { Search } from "@components/Search";
import { ProductCard } from "@components/ProductCard";

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
