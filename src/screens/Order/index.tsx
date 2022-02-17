import React from "react";
import { Platform } from "react-native";

import { Container, Header, Photo , Sizes} from "./styles";

import { ButtonBack } from "@components/ButtonBack";
import { RadioButton } from "@components/RadioButton";

export function Order() {
  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header>
        <ButtonBack onPress={() => {}} style={{ marginBottom: 108 }} />
      </Header>
      <Photo source={{ uri: "https:www.github.com/paulokaome.png" }} />
      <Sizes>
          <RadioButton
            title="Pequeno"
            selected={false}
          />
           <RadioButton
            title="Médio"
            selected={false}
          />
           <RadioButton
            title="Grande"
            selected={false}
          />
      </Sizes>
    </Container>
  );
}
