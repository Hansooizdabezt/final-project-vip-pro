/* eslint-disable no-unused-vars */
import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ColumnChart from "./ColumnChart";

export default function ChartPost() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [timePeriod, setTimePeriod] = useState("last7days");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `/api/user/getusers?limit=5&timePeriod=${timePeriod}`
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?limit=5&timePeriod=${timePeriod}`
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `/api/comment/getcomments?limit=5&timePeriod=${timePeriod}`
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.role === "admin") {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser, timePeriod]);

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  return (
    <div className="justify-center mx-10">
      <div id="column-chart">
        {/* Truyền totalPosts và totalComments vào biểu đồ */}
        <ColumnChart totalPosts={totalPosts} totalComments={totalComments} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <select
          value={timePeriod}
          onChange={(e) => handleTimePeriodChange(e.target.value)}
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
        </select>
      </div>
    </div>
  );
}
