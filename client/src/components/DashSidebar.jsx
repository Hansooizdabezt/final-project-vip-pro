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

export default function DashSidebar() {
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

  // Hàm viết hoa chữ cái đầu tiên
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.role === "admin" && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={capitalizeFirstLetter(currentUser.role)}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.role === "admin" && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiOutlineDocumentDuplicate}
                as="div"
              >
                All Posts
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=myposts">
            <Sidebar.Item
              active={tab === "myposts"}
              icon={HiOutlineDocumentText}
              as="div"
            >
              My Posts
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=bookmark">
            <Sidebar.Item
              active={tab === "bookmark"}
              icon={HiOutlineDocumentText}
              as="div"
            >
              Bookmark
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=mycomments">
            <Sidebar.Item
              active={tab === "mycomments"}
              icon={HiUser}
              labelColor="dark"
              as="div"
            >
              My Comments
            </Sidebar.Item>
          </Link>

          {currentUser.role === "admin" && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiOutlineDocumentText}
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.role === "admin" && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                All Users
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.role !== "user" && (
            <Link to="/dashboard?tab=dashmor">
              <Sidebar.Item
                active={tab === "dashmor"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Post Moderation
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
