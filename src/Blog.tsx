import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useFetchIndexData } from "./helpers/hooks";
import { IndexInterface } from "./helpers/types";

const Blog = function Blog() {
  const { user, posts, resetIndexData, setUser, setPosts } =
    useFetchIndexData();

  return (
    <>
      {user ? (
        <Header reset={resetIndexData} user={user} />
      ) : (
        <Header reset={resetIndexData} />
      )}
      <Outlet
        context={
          {
            user,
            posts,
            resetIndexData,
            setUser,
            setPosts,
          } satisfies IndexInterface
        }
      />
    </>
  );
};

export default Blog;
