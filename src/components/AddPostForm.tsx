import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const AddPostForm = ({ placeholder }: { placeholder: string }) => {
  return (
    <form>
      <Stack direction="row" spacing="4">
        <Link to={`/`}>
          <Avatar src="https://picsum.photos/200?random=pierre" boxSize="12" />
        </Link>
        <FormControl id="text">
          <Textarea
            rows={3}
            resize="none"
            placeholder={placeholder}
            name="text"
            required
          />
        </FormControl>
      </Stack>
      <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
        <Button colorScheme="twitter" type="submit" variant="solid">
          Post message
        </Button>
      </Flex>
    </form>
  );
};
