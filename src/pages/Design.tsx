import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Design() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    iconType: 'Brush',
    titleKey: '',
    order: 0,
  });

  const navigate = useNavigate();

  // Load sections
  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const q = query(collection(db, 'designSections'), orderBy('order'));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateDoc(doc(db, 'designSections', editingId), formData);
      } else {
        await addDoc(collection(db, 'designSections'), formData);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ iconType: 'Brush', titleKey: '', order: 0 });
      loadSections();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleEdit = (section: any) => {
    setEditingId(section.id);

    setFormData({
      iconType: section.iconType,
      titleKey: section.titleKey,
      order: section.order,
    });

    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this section?')) return;

    try {
      await deleteDoc(doc(db, 'designSections', id));
      loadSections();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-12 h-12 rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Design Sections</h1>
          <p className="text-gray-600">Manage categories of design portfolio</p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ iconType: 'Brush', titleKey: '', order: 0 });
          }}
          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white border rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? 'Edit Section' : 'Add Section'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Icon</label>
              <select
                value={formData.iconType}
                onChange={(e) => setFormData({ ...formData, iconType: e.target.value })}
                className="w-full border rounded-xl px-4 py-2"
              >
                <option value="Brush">Brush</option>
                <option value="Layout">Layout</option>
                <option value="Camera">Camera</option>
              </select>
            </div>

            <div>
              <label>Title Key</label>
              <input
                type="text"
                value={formData.titleKey}
                onChange={(e) => setFormData({ ...formData, titleKey: e.target.value })}
                required
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            <div>
              <label>Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                required
                className="w-full border rounded-xl px-4 py-2"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl">
                Save
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div key={section.id} className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">{section.titleKey}</h3>
                <p className="text-gray-500 text-sm">
                  Icon: {section.iconType} — Order: {section.order}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleEdit(section)} className="text-blue-600 p-2">
                  <Edit2 className="w-4 h-4" />
                </button>

                <button onClick={() => handleDelete(section.id)} className="text-red-600 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate(`/design/${section.id}/items`)}
              className="w-full bg-gray-100 rounded-xl py-2 flex items-center justify-center gap-2"
            >
              <Image className="w-4 h-4" />
              Manage Items
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}