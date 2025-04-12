/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashMyPosts from "../components/DashMyPosts";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashboardComp";
import DashMorderation from "../components/DashMorderation";
import DashComments from "../components/DashComments";
import ChartPost from "../components/ChartPost";
import DashSidebarMobile from "../components/DashSidebarMobile";
import DashBookmark from "../components/DashBookmark";
import DashMyComments from "../components/DashMyComments";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <div className="hidden md:block">
          <DashSidebar />
        </div>
        {/* Hiển thị DashSidebarMobile ở điện thoại và ẩn ở iPad trở lên */}
        <div className="md:hidden">
          <DashSidebarMobile />
        </div>
      </div>
      {/* profile */}
      {tab === "profile" && <DashProfile />}
      {/* posts */}
      {tab === "posts" && <DashPosts />}
      {/* my posts */}
      {tab === "myposts" && <DashMyPosts />}
      {/* get users , only admin role */}
      {tab === "users" && <DashUsers />}
      {/* dashboard comp */}
      {tab === "comments" && <DashComments />}
      {/* dashboard comp */}
      {tab === "mycomments" && <DashMyComments />}
      {/* dashboard comp */}
      {tab === "dash" && <DashboardComp />}
      {/* dashboard comp */}
      {tab === "dashmor" && <DashMorderation />}
      {/* dashboard comp */}
      {tab === "chartpost" && <ChartPost />}
      {/* dashboard bookmark */}
      {tab === "bookmark" && <DashBookmark />}
    </div>
  );
}
