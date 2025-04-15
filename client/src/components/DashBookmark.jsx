import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashBookmark() {
  const { currentUser } = useSelector((state) => state.user);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const url = `/api/post/getbookmarkedposts?userId=${currentUser._id}`;
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setBookmarkedPosts(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        } else {
          console.error("Failed to fetch bookmarked posts:", data.message);
        }
      } catch (error) {
        console.log("Error fetching bookmarked posts:", error.message);
      }
    };

    if (currentUser) {
      fetchBookmarkedPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    try {
      const startIndex = bookmarkedPosts.length;
      const url = `/api/post/getbookmarkedposts?userId=${currentUser._id}&startIndex=${startIndex}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setBookmarkedPosts((prevPosts) => [...prevPosts, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {bookmarkedPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Uploaded</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {bookmarkedPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-300">
            You have no post bookmarked. Find some post now !!!
          </p>
          <Link
            to="/"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Explore posts
          </Link>
        </div>
      )}
    </div>
  );
}
