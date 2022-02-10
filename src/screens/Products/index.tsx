import React, { useState } from "react";
import { Platform, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import { InputPrice } from "@components/InputPrice";
import { Input } from "@components/Input";
import { ButtonBack } from "@components/ButtonBack";
import { Button } from "@components/Button";
import { Photo } from "@components/Photo";

import {
  Container,
  Header,
  Title,
  DeleteLabel,
  PhotoUpload,
  PickImage,
  Form,
  InputGroup,
  InputGroupHeader,
  Label,
  MaxCaracters,
} from "./styles";

export function Products() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceSizeP, setPriceSizeP] = useState("");
  const [priceSizeM, setPriceSizeM] = useState("");
  const [priceSizeG, setPriceSizeG] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePickerImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });
      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  async function handleAdd() {
    if (!name.trim()) return Alert.alert("Erro", "Informe o nome da pizza");
    if (!description.trim())
      return Alert.alert("Erro", "Informe a descrição da pizza");
    if (!image) return Alert.alert("Erro", "Selecione a imagem da pizza");
    if (!priceSizeP || !priceSizeM || !priceSizeG) {
      return Alert.alert(
        "Erro",
        "Informe o preço de todos os tamanhos da pizza"
      );
    }
    setIsLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`); // Referencia da Pizza
    await reference.putFile(image); //Pegando a referencia e setando no banco!
    const photo_url = await reference.getDownloadURL(); //Url da imagem!

    firestore() //Cadastro no banco !!
      .collection("pizzas")
      .add({
        name,
        name_insensitive: name.toLocaleLowerCase().trim(),
        price_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath,
      })
      .then(() => Alert.alert("Cadastro", "Pizza Cadastrada com sucesso"))
      .catch(() => Alert.alert("Erro", "Não foi possível cadastrar a pizza"));

      setIsLoading(false);
  }

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack />
          <Title>Cadastrar</Title>
          <TouchableOpacity>
            <DeleteLabel>Deletar</DeleteLabel>
          </TouchableOpacity>
        </Header>
        <PhotoUpload>
          <Photo uri={image} />
          <PickImage
            title="Carregar"
            type="secondary"
            onPress={handlePickerImage}
          />
        </PhotoUpload>
        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCaracters>0 de 60 caracteres</MaxCaracters>
            </InputGroupHeader>
            <Label>Nome</Label>
            <Input
              onChangeText={setDescription}
              multiline
              maxLength={60}
              style={{ height: 80 }}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanho e preços</Label>
            <InputPrice
              size="P"
              onChangeText={setPriceSizeP}
              value={priceSizeP}
            />
            <InputPrice
              size="M"
              onChangeText={setPriceSizeM}
              value={priceSizeM}
            />
            <InputPrice
              size="G"
              onChangeText={setPriceSizeG}
              value={priceSizeG}
            />
          </InputGroup>

          <Button
            title="Cadastrar Pizza"
            isLoading={isLoading}
            onPress={handleAdd}
          />
        </Form>
      </ScrollView>
    </Container>
  );
}
