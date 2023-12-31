import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import NavbarHome from "../components/navbarHome";
import { CiMenuKebab } from "react-icons/ci";
import { BsChat } from "react-icons/bs";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import PopupVerif from "../components/popupVerif";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import moment from "moment/moment";
import Footer from "../components/Footer";

export default function HomePage() {
  const userSelector = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState({});
  console.log(likes);

  useEffect(() => {
    fetchPost();
    fetchLikes();
  }, []);

  const fetchPost = async () => {
    try {
      //get posts dari server disimpan di variable response
      const response = await api.get("/posts");
      //mengurutkan post berdasarkan tanggal menggunakan metod sort pada response
      //Dengan demikian, postingan akan diurutkan secara menurun berdasarkan tanggalnya.
      const sortedPosts = response.data.sort((a, b) =>
        moment(b.date).diff(a.date)
      );
      // updatePosts berisi hasil pemetaan semua post yg telah di urutkan
      //setiap post di maping menjadi objek baru dgn menggunakan operator
      //spread {...post, comments: []}
      //dalam objek baru ini kita menambahkan property baru 'comments' dgn nilai array kosong
      const updatedPosts = sortedPosts.map((post) => ({
        ...post,
        comments: [],
      }));
      //simpang upatePost ke dalam state setPosts
      setPosts(updatedPosts);

      // Fetch comments di setiap post yang ada
      updatedPosts.forEach((post) => {
        fetchComments(post.id);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async (post_id) => {
    try {
      const response = await api.get(`/comments/${post_id}`); //get komen by post_id
      const comments = response.data;
      //mengakses nilai sebelumnya(prevPosts) dalam setPosts
      setPosts((prevPosts) => {
        //membuat variable baru(updtposts), lalu prevposts di maping ulang
        const updatedPosts = prevPosts.map((post) => {
          //jika prevPost.id === post_id
          if (post.id === post_id) {
            //maka gabungkan comments(response.data) ke prevPosts
            return { ...post, comments: comments };
            // Ini menghasilkan objek baru yang merupakan
            // salinan dari postingan sebelumnya dengan properti comments yang diperbarui.
          }
          //jika prevPosts !== post_id, return prevPost tanpa perubahan
          return post;
        });
        // Setelah selesai memetakan semua postingan,
        // kita mengembalikan updatedPosts sebagai nilai pembaruan state posts.
        return updatedPosts;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLikes = async () => {
    try {
      // mengambil data yang berisi
      // daftar like yang terkait dengan pengguna yang dipilih (userSelector.id).
      const response = await api.get(`/likes/${userSelector.id}`);
      //menggubah response.data berbentuk array menjadi objek
      //pada awalnya akumulator('acc') di inisial sebagai objek kosong('{}')
      //Setiap elemen dalam array response.data diteruskan ke fungsi reduce sebagai parameter like.
      const likesData = response.data.reduce((acc, like) => {
        //setiap iterasi, entri baru di tambahkan ke objek acc,
        //key dari entri ini adalah `like.post_id`
        //acc memiliki value yaitu `like.status`
        acc[like.post_id] = like.status;
        // setelah setiap elemen dalam array di olah, objek acc diperbarui dan di kembalikan
        return acc;
      }, {});
      //dgn demikian hasil akhir dari reduce() akan berupa objek `likesData`
      setLikes(likesData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeUnlike = async (post_id) => {
    try {
      //jika likes[post_id] === 'LIKE', maka post dgn id tersebut sudah di like
      //dan variable liked bernilai true
      const liked = likes[post_id] === "LIKE";
      console.log(liked);
      if (liked) {
        //jika liked == true, maka delete like
        await api.delete(`/likes/${post_id}`, {
          data: { user_id: userSelector.id },
        });
      } else {
        //jika liked == false, maka post like
        await api.post(`/likes/${post_id}`, { user_id: userSelector.id });
      }
      fetchLikes();
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentInputChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async (post_id) => {
    try {
      if (!newComment) {
        console.log("isi komen anda");
      } else {
        const response = await api.post(`/comments/${post_id}`, {
          user_id: userSelector.id,
          content: newComment,
        });
        console.log(response.data);
        const comment = response.data;

        setPosts((prevPosts) => {
          const updatedPosts = prevPosts.map((post) => {
            if (post.id === post_id) {
              return { ...post, comments: [...post.comments, comment] };
            }
            return post;
          });
          return updatedPosts;
        });

        setNewComment("");
        fetchComments(post_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <NavbarHome />
      {userSelector.status == "unverified" ? <PopupVerif /> : null}
      {posts.length === 0 ? (
        <Box>
          <Center h={"100vh"}>
            <Text>no post avaible</Text>
          </Center>
        </Box>
      ) : (
        <Box>
          <Center>
            <Flex
              flexDir={"column"}
              w={"100vw"}
              maxW={"470px"}
              p={2}
              pt={"80px"}
              pb={"35px"}
              border={"1px"}
              h={!posts ? "100vh" : null}
            >
              {posts?.map((post) => {
                const liked = likes[post.id] === "LIKE";
                return (
                  <>
                    <Box key={post.id} mb={5}>
                      <Flex
                        justifyContent={"space-between"}
                        align={"center"}
                        p={1}
                        border={"1px"}
                      >
                        <Flex gap={3} w={"90%"}>
                          <Box>
                            <Avatar src={post.user.avatar_url} />
                          </Box>
                          <Box flexDir={"column"}>
                            <Flex gap={1}>
                              <Text>{post.user.username}</Text>-
                              <Text>
                                {moment(post.date).startOf("minute").fromNow()}
                              </Text>
                            </Flex>

                            <Text>location</Text>
                          </Box>
                        </Flex>
                        <Box boxSize={8}>
                          <Image as={CiMenuKebab} size={"lg"} />
                        </Box>
                      </Flex>

                      <Box w={"100%"} maxH={"470px"} borderInline={"1px"}>
                        <Image
                          objectFit={"contain"}
                          src={post.image}
                          h={"100vh"}
                          maxH={"470px"}
                          w={"100vw"}
                          // maxW={"470px"}
                        />
                      </Box>

                      <Flex
                        h={"40px"}
                        w={"100%"}
                        border={"1px"}
                        gap={2}
                        align={"center"}
                        p={2}
                        justifyContent={"space-between"}
                      >
                        <Flex align={"center"} gap={5}>
                          <Box boxSize={7}>
                            <Image
                              as={liked ? AiFillHeart : AiOutlineHeart}
                              onClick={() => handleLikeUnlike(post.id)}
                            />
                          </Box>
                          <Box boxSize={6}>
                            <Image as={BsChat} size={"lg"} />
                          </Box>
                          <Box boxSize={6}>
                            <Image as={IoPaperPlaneOutline} size={"lg"} />
                          </Box>
                        </Flex>

                        <Box boxSize={6}>
                          <Image as={BsBookmark} size={"lg"} />
                        </Box>
                      </Flex>

                      <Flex border={"1px"} px={2} gap={2}>
                        <Text>
                          {post.likes} {post.likes < 2 ? "Like" : "Likes"}
                        </Text>
                      </Flex>

                      <Flex borderX={"1px"} px={2} gap={2}>
                        <Text fontWeight={"bold"}>{post.user.username}</Text>
                        <Text>{post.caption}</Text>
                      </Flex>

                      <Box border={"1px"} px={2} gap={2}>
                        <Text textColor={"gray"} fontSize={"13px"}>
                          {post.comments.length > 1
                            ? `View all ${post.comments.length} comments`
                            : null}
                        </Text>
                      </Box>

                      {post?.comments.map((comment) => (
                        <Flex
                          borderInline={"1px"}
                          px={2}
                          gap={2}
                          key={comment.id}
                        >
                          <Text fontWeight={"bold"}>
                            {comment?.user?.username}
                          </Text>
                          <Text>{comment.content}</Text>
                        </Flex>
                      ))}

                      <Box>
                        <InputGroup size={"sm"}>
                          <Input
                            placeholder="Add a comment..."
                            borderRadius={0}
                            value={newComment}
                            onChange={handleCommentInputChange}
                          />
                          <InputRightAddon>
                            <Button
                              size={"xs"}
                              onClick={() => handleAddComment(post.id)}
                            >
                              Add
                            </Button>
                          </InputRightAddon>
                        </InputGroup>
                      </Box>
                    </Box>
                  </>
                );
              })}
            </Flex>
          </Center>
        </Box>
      )}
      <Footer fetchPost={fetchPost} />
    </>
  );
}
