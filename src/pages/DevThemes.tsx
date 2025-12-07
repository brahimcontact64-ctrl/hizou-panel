import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { DevThemeCategory } from '../types';
import { Plus, Edit2, Trash2, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DevThemes() {
  const [categories, setCategories] = useState<DevThemeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ titleFr: '', titleAr: '', order: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const q = query(collection(db, 'devThemeCategories'), orderBy('order'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DevThemeCategory));
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'devThemeCategories', editingId), formData);
      } else {
        await addDoc(collection(db, 'devThemeCategories'), formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ titleFr: '', titleAr: '', order: 0 });
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: DevThemeCategory) => {
    setEditingId(category.id);
    setFormData({ titleFr: category.titleFr, titleAr: category.titleAr, order: category.order });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'devThemeCategories', id));
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
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
          <h1 className="text-2xl font-bold text-gray-900">Dev Theme Categories</h1>
          <p className="text-gray-600">Manage e-commerce theme categories</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ titleFr: '', titleAr: '', order: 0 });
          }}
          className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (French)</label>
              <input
                type="text"
                value={formData.titleFr}
                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Arabic)</label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                dir="rtl"
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
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-dark transition">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ titleFr: '', titleAr: '', order: 0 });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{category.titleFr}</h3>
                <p className="text-sm text-gray-600 mb-1" dir="rtl">{category.titleAr}</p>
                <p className="text-sm text-gray-500">Order: {category.order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => navigate(`/dev-themes/${category.id}/themes`)}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            >
              <Palette className="w-4 h-4" />
              Manage Themes
            </button>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <p className="text-gray-500">No theme categories yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}
