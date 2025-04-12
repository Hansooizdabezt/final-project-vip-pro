/* eslint-disable no-unused-vars */
import { Modal, Table, Button, Badge } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiOutlineTrash } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin") {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">All Comments</h1>

        {currentUser.role === "admin" && comments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table hoverable className="w-full">
                <Table.Head>
                  <Table.HeadCell>Updated Date</Table.HeadCell>
                  <Table.HeadCell>Content</Table.HeadCell>
                  <Table.HeadCell>Likes</Table.HeadCell>
                  <Table.HeadCell>Post</Table.HeadCell>
                  <Table.HeadCell>User ID</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {comments.map((comment) => (
                    <Table.Row key={comment._id} className="bg-white dark:bg-gray-800">
                      <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString('vi-VN')}</Table.Cell>
                      <Table.Cell className="max-w-xs truncate">{comment.content}</Table.Cell>
                      <Table.Cell>
                        <Badge color="success" className="w-fit">
                          {comment.numberOfLikes} ♥
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <Link 
                          to={`/post/${comment.postSlug || comment.postId}`} 
                          className="text-blue-600 hover:underline"
                        >
                          View Post
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{comment.userId}</Table.Cell>
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
              No comments yet. Once users post comments, they will appear here.
            </p>
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
