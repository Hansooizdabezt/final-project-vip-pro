/* eslint-disable no-unused-vars */
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [file, setFile] = useState(null); // Chỉ một state cho cả ảnh và tài liệu
  const [uploadProgress, setUploadProgress] = useState(null); // Trạng thái upload
  const [uploadError, setUploadError] = useState(null); // Lỗi upload
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  // Hàm upload file (hình ảnh hoặc tài liệu)
  const handleUploadFile = async () => {
    try {
      if (!file) {
        setUploadError("No file selected");
        return;
      }
      setUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setUploadError("File upload failed");
          setUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadProgress(null);
            setUploadError(null);

            // Kiểm tra loại file để lưu vào formData
            if (file.type.startsWith("image/")) {
              setFormData({ ...formData, image: downloadURL }); // Lưu đường dẫn ảnh
            } else {
              setFormData({ ...formData, document: downloadURL }); // Lưu đường dẫn tài liệu
            }
          });
        }
      );
    } catch (error) {
      setUploadError("File upload failed");
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      // ✅ Sau khi tạo bài thành công:
      if (data.role === "admin" || data.role === "censor") {
        toast.success("Post created successfully!");
      }
      if (data.role === "user") {
        toast.info("Post submitted! Waiting for approval.");
      }

      setTimeout(() => {
        navigate("/");
      }, 2000); // Chờ 2s để người dùng kịp thấy thông báo
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <TextInput
            type="text"
            placeholder="Category"
            required
            id="category"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
        </div>

        {/* Chọn file (hình ảnh hoặc tài liệu) */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*,.pdf,.doc,.docx" // Chấp nhận cả ảnh và tài liệu
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadFile}
            disabled={uploadProgress}
          >
            {uploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          You can upload both image and file documents
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}

        {/* Hiển thị preview ảnh hoặc đường dẫn tài liệu sau khi upload */}
        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="w-full h-72 object-cover "
          />
        )}

        {formData.document && (
          <div className="w-full mt-4 flex flex-col gap-2">
            <div className="w-full h-[500px]">
              <iframe
                title="Uploaded document preview"
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                  formData.document
                )}&embedded=true`}
                width="100%"
                height="100%"
                className="border"
              ></iframe>
            </div>
            <Button
              color="failure"
              size="sm"
              className="w-fit"
              onClick={() => setFormData({ ...formData, document: null })}
            >
              Remove Document
            </Button>
          </div>
        )}

        <ReactQuill
          theme="snow"
          className="dark:text-white h-72 mb-12"
          placeholder="Write something..."
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
