import React from "react";

import { Image, Placeholder, PlaceholderText } from "./styles";

type Props = {
  uri: string | null;
};

export function Photo({ uri }: Props) {
  if (uri) {
    return <Image source={{ uri }} />;
  }
  return (
    <Placeholder>
      <PlaceholderText>Nenhuma foto {"\n"} Carregada</PlaceholderText>
    </Placeholder>
  );
}
