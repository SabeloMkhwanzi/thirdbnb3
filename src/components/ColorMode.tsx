import { useColorMode, useColorModeValue, IconButton } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

export const ColorMode = (props: any) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue("light", "dark");
  const SwitchIcon = useColorModeValue(FaSun, FaMoon);

  return (
    <IconButton
      size="md"
      borderRadius="full"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
