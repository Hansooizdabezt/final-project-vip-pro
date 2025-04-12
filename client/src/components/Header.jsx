/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const queryString = location.search;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.searchTerm]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Greenwich&apos;s
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={IoSearchOutline}
          className="hidden lg:inline" // Hiển thị ở chế độ lg trở lên
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          className="w-12 h-10 lg:hidden rounded-full"
          color="gray"
          onClick={() => {
            const urlParams = new URLSearchParams(location.search);
            urlParams.set("searchTerm", searchTerm);
            const searchQuery = urlParams.toString();
            navigate(`/search?${searchQuery}`);
          }}
        >
          <IoSearchOutline />
        </Button>
      </form>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline "
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture}
                rounded
                className="w-10 h-10 object-cover"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Link to={"/create-post"}>
              <Dropdown.Item>Create Post</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            <Dropdown.Divider />

            {/* Thêm nút chuyển đổi Dark/Light mode vào Dropdown */}
            <Dropdown.Item
              className="sm:hidden "
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === "light" ? (
                <div className="flex items-center">
                  <FaMoon className="mr-2" /> Dark Mode
                </div>
              ) : (
                <div className="flex items-center">
                  <FaSun className="mr-2" /> Light Mode
                </div>
              )}
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign in
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>

        {/* Hiển thị My Posts nếu người dùng đã đăng nhập */}
        {currentUser && (
          <Navbar.Link
            active={path === "/dashboard" && queryString === "?tab=myposts"}
            as={"div"}
          >
            <Link to="/dashboard?tab=myposts">My Posts</Link>
          </Navbar.Link>
        )}

        {/* Hiển thị Dashboard nếu người dùng là admin */}
        {currentUser && currentUser.role === "admin" && (
          <Navbar.Link active={path === "/dashboard?tab=dash"} as={"div"}>
            <Link to="/dashboard?tab=dash">Dashboard</Link>
          </Navbar.Link>
        )}

        {/* Hiển thị Post Moderation nếu người dùng là censor */}
        {currentUser && currentUser.role === "cencor" && (
          <Navbar.Link active={path === "/dashboard?tab=dashmor"} as={"div"}>
            <Link to="/dashboard?tab=dashmor">Post Moderation</Link>
          </Navbar.Link>
        )}

        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
