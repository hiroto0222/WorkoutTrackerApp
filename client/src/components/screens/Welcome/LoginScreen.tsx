import Button from "components/base/common/Button";
import globalStyles from "components/styles";
import * as WebBrowser from "expo-web-browser";
import useGoogleLogin from "hooks/auth/useGoogleLogin";
import useLogin from "hooks/auth/useLogin";
import useSignUp from "hooks/auth/useSignUp";
import React, { useState } from "react";
import {
  Div,
  Image,
  Input,
  Button as MagnusButton,
  Text,
} from "react-native-magnus";
import UIConstants from "../../../constants";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { promptAsync } = useGoogleLogin();
  const { signUp } = useSignUp();
  const { login } = useLogin();

  return (
    <>
      <Div flex={1} justifyContent="flex-start" mt="2xl" px={40}>
        <Text mt="3xl" w="70%" fontSize="6xl" style={globalStyles.textBold}>
          Get Started
        </Text>
        <Input
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          mt="2xl"
          px="md"
          py="md"
          borderColor="gray200"
          borderWidth={1}
          placeholder="Email"
        />
        <Input
          value={password}
          onChangeText={(text) => setPassword(text)}
          mt="md"
          px="md"
          py="md"
          borderColor="gray200"
          borderWidth={1}
          placeholder="Password"
          secureTextEntry
        />
        <Button
          onPress={() => login(email, password)}
          buttonType="md"
          bg={UIConstants.COLORS.PRIMARY.REGULAR}
          text="Login"
          color={UIConstants.COLORS.PRIMARY.CONTRAST}
          fontSize="lg"
          marginVertical={15}
        />
        <Button
          onPress={() => signUp(email, password)}
          buttonType="md"
          bg={UIConstants.COLORS.GRAY.LIGHT}
          text="Sign Up"
          color={UIConstants.COLORS.GRAY.LIGHT_CONTRAST}
          fontSize="lg"
        />
        <Div alignItems="center" justifyContent="center" flexDir="row" mt="xl">
          <Div h={1} flex={1} bg="gray400" />
          <Text px="lg" fontSize="sm" color="gray500">
            Or continue with
          </Text>
          <Div h={1} flex={1} bg="gray400" />
        </Div>

        <Div alignItems="center" justifyContent="center" flexDir="row" mt="xl">
          <MagnusButton
            onPress={() => promptAsync()}
            mr="md"
            flex={1}
            py="lg"
            rounded="circle"
            borderWidth={1}
            borderColor="gray200"
            bg="white"
            color="gray900"
            prefix={
              <Image
                h={20}
                w={20}
                mr="md"
                source={require("../../../assets/google.png")}
              />
            }
          >
            Google
          </MagnusButton>
        </Div>
      </Div>
    </>
  );
};

export default LoginScreen;
