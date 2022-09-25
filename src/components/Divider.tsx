import { Box, useColorModeValue } from "@chakra-ui/react";

const DividerBox = () => {
  const DivColor = useColorModeValue("gray.400", "gray.400");
  return (
    <Box
      position="relative"
      top="15"
      height="50%"
      bgColor={DivColor}
      width="1.5px"
      marginRight="20px"
      paddingBottom="15px"
    />
  );
};

export default DividerBox;
