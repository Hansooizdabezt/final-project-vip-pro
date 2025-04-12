/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashMorderation() {
  const { currentUser } = useSelector((state) => state.user);
  const [pendingPosts, setPendingPosts] = useState([]);

  const fetchPendingPosts = async () => {
    try {
      const url = `/api/post/getpendingposts`; // Đường dẫn đã chỉnh sửa
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setPendingPosts(data); // Lưu dữ liệu trực tiếp từ API
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleApprove = async (postId) => {
    try {
      const res = await fetch(`/api/post/approve/${postId}`, {
        method: "PUT",
      });
      if (res.ok) {
        setPendingPosts((prev) => prev.filter((post) => post._id !== postId)); // Cập nhật lại danh sách bài viết
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReject = async (postId) => {
    try {
      const res = await fetch(`/api/post/reject/${postId}`, {
        method: "PUT",
      });
      if (res.ok) {
        setPendingPosts((prev) => prev.filter((post) => post._id !== postId)); // Cập nhật lại danh sách bài viết
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPendingPosts(); // Lấy danh sách bài viết pending khi component mount
  }, []);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {pendingPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date uploaded</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Course</Table.HeadCell>{" "}
              {/* Sửa tiêu đề từ "Major" thành "Category" */}
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {pendingPosts.map((post) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={post._id}
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/pending-post/${post._id}`}>
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
                  <Table.Cell>{post.category}</Table.Cell>{" "}
                  {/* Hiển thị category của bài viết */}
                  <Table.Cell className="flex">
                    <Button
                      onClick={() => handleApprove(post._id)}
                      color="success"
                      className="mr-2"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(post._id)}
                      color="failure"
                    >
                      Reject
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>No posts pending approval.</p>
      )}
    </div>
  );
}
