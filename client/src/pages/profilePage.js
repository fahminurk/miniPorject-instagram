import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Icon,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { FiSettings } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { BsBookmark } from "react-icons/bs";
import { BiUserPin } from "react-icons/bi";
import img from "../assets/tzuyu1.jpg";
import img2 from "../assets/IU.jpg";
import img3 from "../assets/tzuyu1.jpg";
import NavbarProfile from "../components/navbarProfile";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import PopupVerif from "../components/popupVerif";
import { Link } from "react-router-dom";
import EditProfile from "../components/editProfile";
import { api } from "../api/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const userSelector = useSelector((state) => state.auth);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [post, setPost] = useState([]);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    await api.get("/posts/" + userSelector.id).then((res) => {
      console.log(res.data);
      setPost(res.data);
    });
  };

  return (
    <>
      <NavbarProfile />
      {userSelector.status == "unverified" ? <PopupVerif /> : null}

      <Center>
        <Flex
          flexDir={"column"}
          w={"100vw"}
          maxW={"470px"}
          // h={"100vh"}
          p={3}
          pt={"80px"}
          pb={"35px"}
          // border={"1px"}
          gap={3}
        >
          {/* avatar, username, editP */}
          <Flex h={"100vh"} maxH={"87px"} gap={3}>
            <Box minW={"87px"}>
              <Avatar size={"full"} src={userSelector.avatar_url} />
            </Box>

            <Flex
              flexDir={"column"}
              w={"100%"}
              justifyContent={"space-between"}
            >
              <Flex gap={3} align={"center"}>
                <Text fontSize={"25px"}>{userSelector.fullname}</Text>
                <Link to="">
                  <Box boxSize={5}>
                    <Image as={FiSettings} size={"sm"} />
                  </Box>
                </Link>
              </Flex>
              <Box>
                <Button size={"sm"} w={"full"} onClick={onOpen}>
                  <EditProfile isOpen={isOpen} onClose={onClose} />
                  Edit Profile
                </Button>
              </Box>
            </Flex>
          </Flex>
          {/* Bio */}
          <Box>{userSelector.bio}</Box>
          {/* post followers following */}
          <Flex justifyContent={"space-around"}>
            <Box>
              <Flex flexDir={"column"} align={"center"}>
                <Text fontWeight={"bold"}>{post.length}</Text>
                <Text>Posts</Text>
              </Flex>
            </Box>
            <Box>
              <Flex flexDir={"column"} align={"center"}>
                <Text fontWeight={"bold"}>79.8M</Text>
                <Text>Followers</Text>
              </Flex>
            </Box>
            <Box>
              <Flex flexDir={"column"} align={"center"}>
                <Text fontWeight={"bold"}>0</Text>
                <Text>Following</Text>
              </Flex>
            </Box>
          </Flex>
          {/* dashboard, mark, tag */}
          <Flex justifyContent={"space-between"}>
            <Link to="">
              <Box boxSize={8} mx={"30px"}>
                <Image as={RxDashboard} size={"sm"} />
              </Box>
            </Link>
            <Link to="">
              <Box boxSize={8} mx={"30px"}>
                <Image as={BsBookmark} size={"sm"} />
              </Box>
            </Link>
            <Link to="">
              <Box boxSize={8} mx={"30px"}>
                <Image as={BiUserPin} size={"sm"} />
              </Box>
            </Link>
          </Flex>
          {/* post */}

          <Grid templateColumns={"repeat(3, 1fr)"}>
            {post?.map((val, idx) => {
              return (
                <>
                  <Link to={`/post/${val.id}`}>
                    <GridItem
                      w={"100%"}
                      h={"100vh"}
                      maxH={"148px"}
                      maxW={"148px"}
                    >
                      <Image
                        key={idx}
                        src={val.image}
                        objectFit={"cover"}
                        h={"100vh"}
                        maxH={"148px"}
                        w={"100vw"}
                      />
                    </GridItem>
                  </Link>
                </>
              );
            })}
          </Grid>
        </Flex>
      </Center>
      <Footer />
    </>
  );
}
