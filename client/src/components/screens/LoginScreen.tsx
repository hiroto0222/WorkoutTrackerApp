import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import useGoogleLogin from "hooks/useGoogleLogin";
import React, { useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { Button, Div, Image, Input, Text } from "react-native-magnus";
import { auth } from "../../config/firebase";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { promptAsync } = useGoogleLogin();

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password);
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      alert((err as Error).message);
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
        <Div flex={1} mt="2xl">
          <Text mt="3xl" mx="xl" w="70%" fontWeight="bold" fontSize="5xl">
            Get Started
          </Text>
          <Input
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            mx="xl"
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
            mx="xl"
            mt="md"
            px="md"
            py="md"
            borderColor="gray200"
            borderWidth={1}
            placeholder="Password"
            secureTextEntry
          />
          <Button
            onPress={handleLogin}
            mx="xl"
            mt="xl"
            mb="xl"
            py="lg"
            bg="orange500"
            rounded="circle"
            block
          >
            Sign In
          </Button>
          <Button
            onPress={handleSignUp}
            mx="xl"
            mb="xl"
            py="lg"
            bg="gray300"
            rounded="circle"
            block
            color="black"
          >
            Sign Up
          </Button>

          <Div
            mx="xl"
            alignItems="center"
            justifyContent="center"
            flexDir="row"
            mt="xl"
          >
            <Div h={1} flex={1} bg="gray400" />
            <Text px="lg" fontSize="sm" color="gray500">
              Or continue with
            </Text>
            <Div h={1} flex={1} bg="gray400" />
          </Div>

          <Div
            mx="xl"
            alignItems="center"
            justifyContent="center"
            flexDir="row"
            mt="xl"
          >
            <Button
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
                  source={require("../../assets/google.png")}
                />
              }
            >
              Google
            </Button>
          </Div>
        </Div>
      </SafeAreaView>
    </>
  );
};

export default LoginScreen;
