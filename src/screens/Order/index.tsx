import React, { useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { OrderNavigationProps } from "@src/@types/navigation";
import { PIZZA_TYPES } from "@utils/pizzaTypes";

import {
  Container,
  Header,
  Photo,
  Sizes,
  Form,
  FormRow,
  InputGroup,
  Label,
  Price,
  Title,
  ContentScroll,
} from "./styles";

import { ButtonBack } from "@components/ButtonBack";
import { RadioButton } from "@components/RadioButton";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { ProductProps } from "@components/ProductCard";
import { useAuth } from "@hooks/auth";

type PizzasResponse = ProductProps & {
  prices_sizes: {
    [key: string]: any;
  };
};

export function Order() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as OrderNavigationProps;
  const { user } = useAuth();

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState("");
  const [pizza, setPizza] = useState<PizzasResponse>({} as PizzasResponse);
  const [sendingOrder, setSendingOrder] = useState(false);

  const amount = size ? parseInt(pizza.prices_sizes[size]) * quantity : "0,00";

  function handleOrder() {
    if (!size) {
      return Alert.alert("Erro", "Selecione o tamanho da pizza");
    }
    if (!tableNumber) {
      return Alert.alert("Erro", "Informe o número da mesa");
    }
    if (!quantity) {
      return Alert.alert("Erro", "Informe a quantidade");
    }

    setSendingOrder(true);

    firestore()
      .collection("orders")
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        table_number: tableNumber,
        status: "Preparando",
        waiter_id: user?.id,
        image: pizza.photo_url,
      })
      .then(() =>  navigation.navigate("home"))
      .catch(() => {
        Alert.alert("Erro", "Não foi possível realizar o pedido");
        setSendingOrder(false);
      });
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizzas")
        .doc(id)
        .get()
        .then((response) => setPizza(response.data() as PizzasResponse))
        .catch((error) =>
          Alert.alert("Erro", "Não foi possível Carregas os dados da pizza")
        );
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack
            onPress={() => navigation.goBack()}
            style={{ marginBottom: 108 }}
          />
        </Header>
        <Photo source={{ uri: pizza.photo_url }} />
        <Form>
          <Title>{pizza.name}</Title>
          <Label>Selecione o Tamanho da Pizza</Label>
          <Sizes>
            {PIZZA_TYPES.map((item) => (
              <RadioButton
                onPress={() => setSize(item.id)}
                key={item.id}
                title={item.name}
                selected={size === item.id}
              />
            ))}
          </Sizes>
          <FormRow>
            <InputGroup>
              <Label>Número da Mesa</Label>
              <Input keyboardType="numeric" onChangeText={setTableNumber} />
            </InputGroup>
            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>
          <Price>Valor de R$ {amount}</Price>
          <Button
            title="Confirmar Pedido"
            onPress={handleOrder}
            isLoading={sendingOrder}
          />
        </Form>
      </ContentScroll>
    </Container>
  );
}
