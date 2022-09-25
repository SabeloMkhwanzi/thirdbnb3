import { useEffect } from "react";
import { EmbedSDK } from "@epnsproject/frontend-sdk-staging";
import { BellIcon } from "@chakra-ui/icons";

function EspnNotification() {
  useEffect(() => {
    if ("0xF76371C3f5B4b06BC62e3Fb1101E1fa3073Fbb54") {
      // 'your connected wallet address'
      EmbedSDK.init({
        headerText: "Thirdbnb", // optional
        targetID: "sdk-trigger-id", // mandatory
        appName: "consumerApp", // mandatory
        user: "0xF76371C3f5B4b06BC62e3Fb1101E1fa3073Fbb54", // mandatory
        viewOptions: {
          type: "sidebar", // optional [default: 'sidebar', 'modal']
          showUnreadIndicator: true, // optional
          unreadIndicatorColor: "#cc1919",
          unreadIndicatorPosition: "bottom-right",
        },
        theme: "dark",
        onOpen: () => {
          console.log("-> client dApp onOpen callback");
        },
        onClose: () => {
          console.log("-> client dApp onClose callback");
        },
      });
    }

    return () => {
      EmbedSDK.cleanup();
    };
  }, []);

  return (
    <BellIcon
      color="#FF0057"
      aria-label="BellIcon database"
      boxSize="35"
      mx="5"
      my="5"
      id="sdk-trigger-id"
    />
  );
}

export default EspnNotification;
