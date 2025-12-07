// src/pages/CreativeVideos.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Video as VideoIcon,
  Loader2,
} from "lucide-react";

interface VideoItem {
  name: string;
  url: string;
  fullPath: string;
  thumbnail?: string;
}

const SUPPORTED_FORMATS = ["mp4", "mov", "m4v"];

const CreativeVideos: React.FC = () => {
  const { categoryId } = useParams();
  const folder = categoryId ?? "fashion";

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<
    { name: string; progress: number }[]
  >([]);

  const storage = getStorage();
  const basePath = `videos/creatives/${folder}`;

  // -------------------------------------------------------
  // 🔥 Generate Thumbnail (Client-Side)
  // -------------------------------------------------------
  const generateThumbnail = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";

      video.onloadeddata = () => {
        video.currentTime = 0.2;

        const canvas = document.createElement("canvas");
        canvas.width = 480;
        canvas.height = 270;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(url);

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };

      video.onerror = () => resolve(url);
    });
  };

  // -------------------------------------------------------
  // 🔥 Load Videos
  // -------------------------------------------------------
  const loadVideos = async () => {
    setLoading(true);

    try {
      const folderRef = ref(storage, basePath);
      const res = await listAll(folderRef);

      const items: VideoItem[] = await Promise.all(
        res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const thumb = await generateThumbnail(url);

          return {
            name: item.name,
            url,
            fullPath: item.fullPath,
            thumbnail: thumb,
          };
        })
      );

      setVideos(items);
    } catch (err) {
      console.error("Error loading videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [folder]);

  // -------------------------------------------------------
  // 🔥 Upload with Real-Time Progress
  // -------------------------------------------------------
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArr = Array.from(files);

    // Reset progress list
    setUploadingFiles(
      fileArr.map((file) => ({ name: file.name, progress: 0 }))
    );

    for (const file of fileArr) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!SUPPORTED_FORMATS.includes(ext || "")) {
        alert(`❌ Unsupported file type: ${file.name}`);
        continue;
      }

      const fileRef = ref(storage, `${basePath}/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setUploadingFiles((prev) =>
            prev.map((u) =>
              u.name === file.name ? { ...u, progress } : u
            )
          );
        },
        (err) => {
          console.error("Upload error:", err);
          alert("Upload failed.");
        },
        async () => {
          await loadVideos();
        }
      );
    }

    e.target.value = "";
  };

  // -------------------------------------------------------
  // 🔥 Delete Video
  // -------------------------------------------------------
  const handleDelete = async (fullPath: string) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await deleteObject(ref(storage, fullPath));
      setVideos((prev) => prev.filter((v) => v.fullPath !== fullPath));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting video.");
    }
  };

  // -------------------------------------------------------
  // UI START
  // -------------------------------------------------------
  return (
    <div className="p-6 space-y-6">

      {/* ─── Header ───────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <VideoIcon className="w-6 h-6" />
            Creative Videos —
            <span className="text-primary capitalize">{folder}</span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Folder:
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs ml-1">
              {basePath}
            </code>
          </p>
        </div>

        <Link
          to="/creatives"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* ─── Upload Box ───────────────────────────── */}
      <div className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <p className="font-semibold">Upload new videos</p>
          <p className="text-sm text-gray-500">
            Files will be uploaded to{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
              {basePath}
            </code>
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white cursor-pointer hover:bg-blue-700">
          <Upload className="w-4 h-4" />
          <span>Select Videos</span>
          <input
            type="file"
            accept="video/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* ─── Upload Progress List ─────────────────── */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          {uploadingFiles.map((u) => (
            <div key={u.name} className="bg-gray-100 p-3 rounded-xl">
              <p className="text-sm font-medium">{u.name}</p>
              <div className="w-full h-2 bg-gray-300 rounded mt-1">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${u.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {u.progress.toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Videos Grid ─────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-white border rounded-2xl p-6 text-center text-gray-500">
          No videos yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.fullPath}
              className="bg-white rounded-2xl shadow-sm border p-3 space-y-3"
            >
              {/* Thumbnail */}
              <img
                src={video.thumbnail}
                alt=""
                className="w-full rounded-lg aspect-video object-cover bg-black/10"
              />

              {/* Video Player */}
              <video
                src={video.url}
                controls
                className="w-full rounded-lg bg-black/5"
              />

              {/* Info */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 truncate">{video.name}</p>

                <button
                  onClick={() => handleDelete(video.fullPath)}
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CreativeVideos;