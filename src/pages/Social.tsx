import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SocialVideo } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Social() {
  const [videos, setVideos] = useState<SocialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ url: '', title: '', order: 0 });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const q = query(collection(db, 'socialVideos'), orderBy('order'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialVideo));
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'socialVideos', editingId), formData);
      } else {
        await addDoc(collection(db, 'socialVideos'), formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ url: '', title: '', order: 0 });
      loadVideos();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleEdit = (video: SocialVideo) => {
    setEditingId(video.id);
    setFormData({ url: video.url, title: video.title || '', order: video.order });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteDoc(doc(db, 'socialVideos', id));
        loadVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Videos</h1>
          <p className="text-gray-600">Manage social media video content</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ url: '', title: '', order: 0 });
          }}
          className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Video
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Video' : 'Add New Video'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-dark transition"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ url: '', title: '', order: 0 });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{video.title || 'Untitled Video'}</h3>
                <p className="text-sm text-gray-500 break-all">{video.url}</p>
                <p className="text-xs text-gray-400 mt-1">Order: {video.order}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(video)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">No social videos yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}
