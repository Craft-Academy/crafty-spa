import {
  As,
  Box,
  Button,
  ButtonProps,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type NavButtonProps = ButtonProps & {
  icon: As;
  label: string;
  to: string;
  endElement?: ReactNode;
};

export const NavButton = (props: NavButtonProps) => {
  const { icon, label, to, endElement, ...buttonProps } = props;
  return (
    <Button variant="ghost-on-accent" justifyContent="start" {...buttonProps}>
      <HStack spacing="3">
        <Icon as={icon} boxSize="6" color="on-accent-subtle" />
        <Link to={to}>
          <Text>{label}</Text>
        </Link>
        {endElement && <Box>{endElement}</Box>}
      </HStack>
    </Button>
  );
};
