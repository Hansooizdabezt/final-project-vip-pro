import PropTypes from "prop-types"; // Import PropTypes
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

export default function Hero({ posts }) {
  return (
    <div className="lg:mx-52 md:mx-20 flex flex-col md:flex-row justify-between items-center md:gap-14 gap-8">
      <div className="md:w-1/2 w-full items-center">
        <h1 className="md:text-5xl text-3xl font-bold md:leading-tight">
          Welcome to Our Student Blog Platform!
        </h1>
        <p className="text-gray-500 text-xs py-4 sm:text-sm">
          Our blog connects students to share knowledge and helpful resources.
          Post articles, study tips, and join discussions to enhance your
          learning. Be part of our community!
        </p>
      </div>
      <div className="md:w-1/2 w-full mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
        >
          {posts.map((post) => (
            <SwiperSlide key={post._id} className="flex justify-center">
              <Link
                to={`/post/${post.slug}`}
                className="flex flex-col items-center"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full lg:[420px] sm:h-96 h-80" // Kích thước hình ảnh được điều chỉnh ở đây
                />
                <h2 className="text-center mt-2">{post.title}</h2>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
    </div>
  );
}

// Định nghĩa PropTypes cho Hero
Hero.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    })
  ).isRequired,
};
