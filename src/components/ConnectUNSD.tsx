import { useState } from "react";
import UAuth from "@uauth/js";
import { Button } from "@chakra-ui/react";

const uauth = new UAuth({
  clientID: "6f5088be-dc48-4799-9c68-99418f13325c",
  redirectUri: "https://thirdbnb.vercel.app/",
  scope: "openid wallet",
});

function ConnectUNSD() {
  const [Uauth, setUauth] = useState();

  async function Connect() {
    try {
      const authorization = await uauth.loginWithPopup();
      setUauth(JSON.parse(JSON.stringify(authorization))["idToken"]);

      // eslint-disable-next-line no-undef
      await authenticate();
    } catch (error) {
      console.error(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function logOut() {
    uauth.logout();
    logOut();
  }

  function log() {
    if (Uauth === null || Uauth === undefined) {
      Connect();
    } else {
      // logOut();
    }
  }

  const getEllipsisTxt = (str: string | any[], n = 4) => {
    if (str) {
      return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
    }
    return "";
  };

  // console.log(Uauth.wallet_address);
  // console.log(Uauth.sub);

  return (
    <>
      <Button
        ml={2}
        colorScheme="teal"
        variant="outline"
        fontSize={{ base: "ms", md: "md" }}
        cursor="pointer"
        textAlign="center"
        borderColor="teal"
        borderRadius="2xl"
        maxW="100%"
        onClick={log}
      >
        {Uauth != null
          ? Uauth["sub"] + " as " + getEllipsisTxt(Uauth["wallet_address"])
          : "Login UNSDomain"}
      </Button>
    </>
  );
}

export default ConnectUNSD;
function authenticate() {
  throw new Error("Function not implemented.");
}
