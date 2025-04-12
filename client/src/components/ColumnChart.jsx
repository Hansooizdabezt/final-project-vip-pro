import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import PropTypes from "prop-types";
Chart.register(...registerables);

export default function ColumnChart({ totalPosts, totalComments }) {
  const chartRef = useRef(null);
  let myChart = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Xóa chart cũ nếu có
      if (myChart.current) {
        myChart.current.destroy();
      }

      // Tạo biểu đồ mới
      myChart.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Posts", "Comments"], // Nhãn trên trục X
          datasets: [
            {
              label: "Total",
              data: [totalPosts, totalComments], // Dữ liệu số bài viết và bình luận
              backgroundColor: [
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
              borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              // Loại bỏ tiêu đề
              title: {
                display: false,
              },
            },
            x: {
              title: {
                display: true,
                text: "Categories",
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    }
  }, [totalPosts, totalComments]);

  return (
    <canvas
      ref={chartRef}
      style={{ height: "300px", width: "600px" }} // Tăng chiều cao
    />
  );
}

ColumnChart.propTypes = {
  totalPosts: PropTypes.number.isRequired,
  totalComments: PropTypes.number.isRequired,
};
