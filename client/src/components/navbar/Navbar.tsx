import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";

import { Logo } from "~components/logo/Logo";

import { useAuth } from "~features/auth";

import { AuthLinks, AuthMenu, Links, NavItem, NavLink } from "./components";

const Navbar = ({ ...rest }) => {
  const {
    isOpen: isNavOpen,
    onOpen: openNav,
    onClose: closeNav,
  } = useDisclosure();
  const { isAuthenticated, user, signOut } = useAuth();
  const links = isAuthenticated ? AuthLinks : Links;

  return (
    <Box
      ml={0}
      height="20"
      zIndex="10"
      position="sticky"
      top={0}
      bg={"darkBlue.500"}
      color={"white"}
    >
      <Container
        as={Flex}
        alignItems={"center"}
        justifyContent={"space-between"}
        {...rest}
        maxW={"6xl"}
        direction={"row"}
      >
        <IconButton
          size={"md"}
          _hover={{
            bg: "grey.600",
          }}
          bg={"darkBlue.500"}
          color={"white"}
          icon={isNavOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isNavOpen ? closeNav : openNav}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Logo destination="/" />
          {isAuthenticated ? <NavLink /> : <></>}
        </HStack>
        <HStack
          h="20"
          alignItems="center"
          spacing={{ base: "0", sm: "2", lg: "6" }}
        >
          {isAuthenticated ? (
            <AuthMenu user={user} handleSignOutClick={signOut} />
          ) : (
            <Button
              as={"a"}
              fontSize={"sm"}
              fontWeight={600}
              display={{ base: "none", md: "flex" }}
              color={"white"}
              bg={"blue.400"}
              href={"/login"}
              _hover={{
                bg: "blue.300",
              }}
            >
              Sign In
            </Button>
          )}
        </HStack>
      </Container>
      {isNavOpen ? (
        <Box pb={4} display={{ md: "none" }} bg={"darkBlue.500"}>
          <Stack as={"nav"} spacing={4}>
            {links.map((link) => (
              <NavItem key={link.name} href={link.href}>
                {link.name}
              </NavItem>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;
