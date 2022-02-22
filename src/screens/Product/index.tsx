import React, { useState, useEffect, useCallback } from "react";
import {
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { ProductNavigationProps } from "../../@types/navigation";

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
import { ProductProps } from "@components/ProductCard";

type PizzaResponse = ProductProps & {
  photo_path: string;
  prices_sizes: {
    p: string;
    m: string;
    g: string;
  };
};

export function Product() {
  const [photoPath, setPhotoPath] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceSizeP, setPriceSizeP] = useState("");
  const [priceSizeM, setPriceSizeM] = useState("");
  const [priceSizeG, setPriceSizeG] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();
  const route = useRoute();
  const { id } = route.params as ProductNavigationProps;

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
        prices_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath,
        description,
      })
      .then(() => {
        Alert.alert("Cadastro", "Pizza Cadastrada com sucesso");
        navigation.reset({ index: 0, routes: [{ name: "home" }] });
      })
      .catch(() => Alert.alert("Erro", "Não foi possível cadastrar a pizza"));

    setIsLoading(false);
  }

  async function handleDelete() {
    firestore()
      .collection("pizzas")
      .doc(id)
      .delete()
      .then(() => {
        storage()
          .ref(photoPath)
          .delete()
          .then(() =>
            navigation.reset({ index: 0, routes: [{ name: "home" }] })
          );
      });
  }

  async function handleUpdate() {
    firestore()
      .collection("pizzas")
      .doc(id)
      .update({
        name,
        name_insensitive: name.toLocaleLowerCase().trim(),
        prices_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        description,
      })
      .then(() => Alert.alert("Edição", "Pizza Editada com sucesso"))
      .catch(() => Alert.alert("Edição", "Houve uma falha na edição da pizza"));
  }

  useFocusEffect(
    useCallback(() => {
      if (id) {
        firestore()
          .collection("pizzas")
          .doc(id)
          .get()
          .then((response) => {
            console.log(response);
            const product = response.data() as PizzaResponse;
            setName(product.name);
            setDescription(product.description);
            setImage(product.photo_url);
            setPriceSizeP(product.prices_sizes.p);
            setPriceSizeM(product.prices_sizes.m);
            setPriceSizeG(product.prices_sizes.g);
            setPhotoPath(product.photo_path);
          });
      } else {
      }
    }, [id])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "tabPress",
      (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        navigation.reset({ index: 0, routes: [{ name: "product" }] });
      }
    );

    return unsubscribe;
  }, [navigation]);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <ButtonBack
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: "home" }] })
            }
          />
          <Title>Cadastrar</Title>
          {id ? (
            <TouchableOpacity onPress={handleDelete}>
              <DeleteLabel>Deletar</DeleteLabel>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 20 }} />
          )}
        </Header>
        <PhotoUpload>
          <Photo uri={image} />
          {!id && (
            <PickImage
              title="Carregar"
              type="secondary"
              onPress={handlePickerImage}
            />
          )}
        </PhotoUpload>
        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição</Label>
              <MaxCaracters>
                {description?.length} de 60 caracteres
              </MaxCaracters>
            </InputGroupHeader>
            <Input
              onChangeText={setDescription}
              value={description}
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
          {!id ? (
            <Button
              title="Cadastrar Pizza"
              isLoading={isLoading}
              onPress={handleAdd}
            />
          ) : (
            <Button
              title="Editar Pizza"
              isLoading={isLoading}
              onPress={handleUpdate}
            />
          )}
        </Form>
      </ScrollView>
    </Container>
  );
}
