/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";

export default function PendingPostPage() {
  const { postId } = useParams(); // Lấy postId từ URL
  const navigate = useNavigate(); // Khai báo useNavigate
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/post/pending/${postId}`); // Lấy thông tin bài viết bằng ID
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/post/approve/${postId}`, {
        method: "PUT",
      });
      if (res.ok) {
        navigate("/dashboard?tab=dashmor"); // Điều hướng về trang dashboard
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`/api/post/reject/${postId}`, {
        method: "PUT",
      });
      if (res.ok) {
        navigate("/dashboard?tab=dashmor"); // Điều hướng về trang dashboard
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl"></Spinner>
      </div>
    );

  if (error) return <p>Failed to fetch post.</p>;

  if (!post) return <p>Loading...</p>;

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link
        to={`/search?category=${post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>
      <img
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
        src={post.image}
        alt={post.title}
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      {post.document && (
        <div className="p-3 max-w-2xl mx-auto w-full">
          <a
            href={post.document}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download attached document
          </a>
        </div>
      )}

      {/* Nút Approve và Reject */}
      <div className="flex justify-center p-3 gap-4">
        <Button onClick={handleApprove} color="success">
          Approve
        </Button>
        <Button onClick={handleReject} color="failure">
          Reject
        </Button>
      </div>
    </main>
  );
}
