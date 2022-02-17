import styled, { css } from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Button } from "@components/Button";

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND};
`;

export const Header = styled(LinearGradient).attrs(({ theme }) => ({
  colors: theme.COLORS.GRADIENT,
}))`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: ${getStatusBarHeight() + 33}px 24px 24px;
`;

export const Title = styled.Text`
  font-size: 24px;
  ${({ theme }) => css`
    color: ${theme.COLORS.TITLE}
    font-family: ${theme.FONTS.TITLE}
  `};
`;

export const DeleteLabel = styled.Text`
  font-size: 14px;
  ${({ theme }) => css`
    color: ${theme.COLORS.TITLE}
    font-family: ${theme.FONTS.TEXT}
  `};
`;

export const PhotoUpload = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 32px 0px;
`;

export const PickImage = styled(Button)`
  max-width: 90px;
  margin-left: 32px;
`;

export const Form = styled.View`
  width: 100%;
  padding: 25px;
`;
export const Label = styled.Text`
  margin-bottom: 12px;
  font-size: 14px;

  ${({ theme }) => css`
    color: ${theme.COLORS.SECONDARY_900}
    font-family: ${theme.FONTS.TEXT}
  `};
`;

export const InputGroup = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

export const InputGroupHeader = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MaxCaracters = styled.Text`
  font-size: 10px;
  margin-bottom: 12px;

  ${({ theme }) => css`
    color: ${theme.COLORS.SECONDARY_900}
    font-family: ${theme.FONTS.TEXT}
  `};
`;
