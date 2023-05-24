import { Button, useMultiStyleConfig, useTab } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export const NavTab = React.forwardRef<
  any,
  { to: string; children: ReactNode }
>((props, ref) => {
  const tabProps = useTab({ ...props, ref });

  const styles = useMultiStyleConfig("Tabs", tabProps);

  return (
    <NavLink to={props.to} end>
      {({ isActive }) => {
        return (
          <Button __css={styles.tab} {...tabProps} aria-selected={isActive}>
            {tabProps.children}
          </Button>
        );
      }}
    </NavLink>
  );
});
