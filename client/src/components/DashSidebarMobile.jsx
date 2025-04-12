import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiOutlineDocumentDuplicate,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebarMobile() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Hàm để xác định tên button link dựa trên tab hiện tại
  const getLabel = (tab) => {
    switch (tab) {
      case "dash":
        return "Dashboard";
      case "profile":
        return "Profile";
      case "posts":
        return "All Posts";
      case "myposts":
        return "My Posts";
      case "comments":
        return "Comments";
      case "users":
        return "All Users";
      case "dashmor":
        return "Post Moderation";
      case "bookmark":
        return "Bookmark";
      default:
        return "Dashboard"; // Giá trị mặc định
    }
  };
  return (
    <div className="md:hidden">
      {/* Hiển thị Sidebar Collapse ở màn hình nhỏ */}
      <Sidebar className="w-full no-dot">
        <Sidebar.Collapse label={getLabel(tab)} icon={null}>
          {currentUser && currentUser.role === "admin" && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item active={tab === "dash" || !tab} icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item active={tab === "profile"} icon={HiUser}>
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.role === "admin" && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiOutlineDocumentDuplicate}
              >
                All Posts
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=bookmark">
            <Sidebar.Item
              active={tab === "bookmark"}
              icon={HiOutlineDocumentText}
              as="div"
            >
              Bookmark
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=myposts">
            <Sidebar.Item
              active={tab === "myposts"}
              icon={HiOutlineDocumentText}
            >
              My Posts
            </Sidebar.Item>
          </Link>
          {currentUser.role === "admin" && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiOutlineDocumentText}
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.role === "admin" && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup}>
                All Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item icon={HiArrowSmRight} onClick={handleSignout}>
            Sign out
          </Sidebar.Item>
        </Sidebar.Collapse>
      </Sidebar>
    </div>
  );
}
