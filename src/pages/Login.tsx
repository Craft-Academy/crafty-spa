import { GitHubIcon, GoogleIcon } from "@/components/ProviderIcons";
import { selectIsUserAuthenticated } from "@/lib/auth/reducer";
import { authenticateWithGithub } from "@/lib/auth/usecases/authenticate-with-github.usecase";
import { authenticateWithGoogle } from "@/lib/auth/usecases/authenticate-with-google.usecase";
import { AppDispatch } from "@/lib/create-store";
import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const isUserAuthenticated = useSelector(selectIsUserAuthenticated);
  const [googleAuthenticating, setGoogleAuthenticating] = useState(false);
  const [githubAuthenticating, setGithubAuthenticating] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const authWithGoogle = () => {
    setGoogleAuthenticating(true);
    dispatch(authenticateWithGoogle())
      .unwrap()
      .finally(() => setGoogleAuthenticating(false));
  };

  const authWithGithub = () => {
    setGithubAuthenticating(true);
    dispatch(authenticateWithGithub())
      .unwrap()
      .finally(() => setGithubAuthenticating(false));
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate("/");
    }
  }, [isUserAuthenticated, navigate]);

  if (isUserAuthenticated) return null;

  return (
    <Container maxW="md" py={{ base: "12", md: "24" }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={{ base: "xs", md: "sm" }}>
              Log in to your account
            </Heading>
            <Text color="muted">Crafty</Text>
          </Stack>
        </Stack>
        <Stack spacing="6">
          <Stack spacing="3">
            <Button
              variant="secondary"
              leftIcon={<GoogleIcon boxSize="5" />}
              iconSpacing="3"
              onClick={authWithGoogle}
              isLoading={googleAuthenticating}
            >
              Continue with Google
            </Button>
            <Button
              variant="secondary"
              leftIcon={<GitHubIcon boxSize="5" />}
              iconSpacing="3"
              onClick={authWithGithub}
              isLoading={githubAuthenticating}
            >
              Continue with GitHub
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
