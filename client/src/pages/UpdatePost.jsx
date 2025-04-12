/* eslint-disable no-unused-vars */
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [document, setDocument] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData(data.posts[0]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUpload = async (type) => {
    const fileToUpload = type === "image" ? file : document;

    if (!fileToUpload) {
      setUploadError(`No ${type} file selected`);
      return;
    }

    setUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + fileToUpload.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      () => {
        setUploadError(`${type} upload failed`);
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadProgress(null);
          setFormData((prevFormData) => ({
            ...prevFormData,
            [type]: downloadURL, // Cập nhật URL cho `image` hoặc `document`
          }));
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.status !== 200) {
        setPublishError(data.message || "Error occurred");
        return;
      }
      setPublishError(null);
      toast.success("Post updated successfully!");
      setTimeout(() => {
        navigate(`/`);
      }, 2000);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-2-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
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
            value={formData.title}
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
            value={formData.category}
          />
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-4 border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={() => handleUpload("image")}
            disabled={uploadProgress}
          >
            {uploadProgress && formData.image ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded"
              className="w-full h-72 object-cover mt-4"
            />
          )}
        </div>

        {/* Upload Document */}
        <div className="flex flex-col gap-4 border-4 border-blue-500 border-dotted p-3 mt-5">
          <FileInput
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setDocument(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="cyanToBlue"
            size="sm"
            outline
            onClick={() => handleUpload("document")}
            disabled={uploadProgress}
          >
            {uploadProgress && formData.document ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Document"
            )}
          </Button>
          {formData.document && (
            <div className="mt-4">
              <p>Uploaded Document:</p>
              <iframe
                src={`https://docs.google.com/gview?url=${formData.document}&embedded=true`}
                style={{ width: "100%", height: "500px" }}
                frameBorder="0"
              ></iframe>
            </div>
          )}
        </div>

        <ReactQuill
          theme="snow"
          value={formData.content}
          className="dark:text-white h-72 mb-12"
          placeholder="Write something..."
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
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
