import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";
import { useTheme } from "styled-components";
import { Feather } from "@expo/vector-icons";

import {
  Container,
  Content,
  Description,
  Details,
  Image,
  Line,
  Name,
  Identifiation,
} from "./styles";

export type ProductProps = {
  id: string;
  name: string;
  photo_url: string;
  description: string;
};

type Props = RectButtonProps & {
  data: ProductProps;
};

export function ProductCard({ data, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container>
      <Content {...rest}>
        <Image source={{ uri: data.photo_url }} />
        <Details>
          <Identifiation>
            <Name>{data.name}</Name>
            <Feather name="chevron-right" size={18} color={COLORS.SHAPE} />
          </Identifiation>
          <Description>{data.description}</Description>
        </Details>
      </Content>
      <Line />
    </Container>
  );
}
