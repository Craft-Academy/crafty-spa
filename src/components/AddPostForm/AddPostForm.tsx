import { AppDispatch } from "@/lib/create-store";
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Stack,
  Text,
  TextProps,
  Textarea,
} from "@chakra-ui/react";
import { nanoid } from "@reduxjs/toolkit";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createAddPostFormViewModel } from "./add-post-form.viewmodel";

interface AddPostFormElements extends HTMLFormControlsCollection {
  text: HTMLTextAreaElement;
}

interface IAddPostForm extends HTMLFormElement {
  readonly elements: AddPostFormElements;
}

export const AddPostForm = ({
  placeholder,
  timelineId,
}: {
  placeholder: string;
  timelineId: string;
}) => {
  const [charactersCount, setCharactersCount] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const {
    postMessage,
    handleTextChange,
    canSubmit,
    remaining,
    inputBackroundColor,
    charCounterColor,
    authUser,
  } = useSelector(
    createAddPostFormViewModel({
      dispatch,
      messageId: nanoid(5),
      timelineId,
      maxCharacters: 100,
      charactersCount,
      setCharactersCount,
    })
  );
  const textarea = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: FormEvent<IAddPostForm>) => {
    event.preventDefault();
    const text = event.currentTarget.elements.text.value;
    postMessage(text);
    if (textarea.current) {
      textarea.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing="4">
        <Link to={authUser.profileUrl}>
          <Avatar src={authUser.profilePicture} boxSize="12" />
        </Link>
        <FormControl id="text">
          <Textarea
            ref={textarea}
            rows={3}
            resize="none"
            placeholder={placeholder}
            bgColor={inputBackroundColor}
            name="text"
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
              handleTextChange(event.target.value);
            }}
            required
          />
        </FormControl>
      </Stack>
      <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
        <Button
          colorScheme="twitter"
          type="submit"
          variant="solid"
          isDisabled={!canSubmit}
        >
          Post message
        </Button>
        <MaxCharCounter
          remaining={remaining}
          color={charCounterColor}
          alignSelf="center"
          mr={5}
        />
      </Flex>
    </form>
  );
};

const MaxCharCounter = ({
  remaining,
  ...textProps
}: {
  remaining: number;
} & TextProps) => <Text {...textProps}>{remaining}</Text>;
