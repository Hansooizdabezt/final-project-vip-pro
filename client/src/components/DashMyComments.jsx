/* eslint-disable no-unused-vars */
import { Modal, Table, Button, Badge } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashMyComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [userComments, setUserComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        const res = await fetch("/api/comment/mycomments", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUserComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchMyComments();
  }, []);

  const handleShowMore = async () => {
    const startIndex = userComments.length;
    try {
      const res = await fetch(`/api/comment/mycomments?startIndex=${startIndex}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUserComments((prev) => [...prev, ...data.comments]);
        setShowMore(data.comments.length >= 9);
      }
    } catch (error) {
      console.error("Error get comments:", error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );
      
      if (res.ok) {
        setUserComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Comments</h1>
        
        {userComments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table hoverable className="w-full">
                <Table.Head>
                  <Table.HeadCell>Posted Date</Table.HeadCell>
                  <Table.HeadCell>Content</Table.HeadCell>
                  <Table.HeadCell>Likes</Table.HeadCell>
                  <Table.HeadCell>Post</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {userComments.map((comment) => (
                    <Table.Row key={comment._id} className="bg-white dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap">
                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </Table.Cell>
                      <Table.Cell className="max-w-xs truncate">
                        {comment.content}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color="success" className="w-fit">
                          {comment.numberOfLikes} ♥
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Link 
                          to={`/post/${comment.postSlug}`} 
                          className="text-blue-600 hover:underline"
                        >
                          View Post
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex space-x-2">
                          <Button size="xs" color="failure" onClick={() => {
                            setShowModal(true);
                            setCommentIdToDelete(comment._id);
                          }}>
                            <HiOutlineTrash className="mr-1" /> Delete
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {showMore && (
              <div className="text-center mt-4">
                <Button gradientMonochrome="teal" onClick={handleShowMore}>
                  Load more comments
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-300">
              You haven&apos;t posted any comments yet. Join the discussion now!
            </p>
            <Link 
              to="/search?searchTerm=" 
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Explore Posts
            </Link>
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
