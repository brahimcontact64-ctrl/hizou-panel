// ===============================
// Creatives.tsx — FIXED VERSION
// ===============================

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../services/firebase";
import { Plus, Edit2, Trash2, Folder, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ----------------------------
// TYPES
// ----------------------------
interface CreativeCategory {
  id: string;
  labelKey: string;
  order: number;
  folder: string;
  title?: {
    fr: string;
    ar: string;
    en: string;
  };
}

const Creatives: React.FC = () => {
  const [categories, setCategories] = useState<CreativeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    labelKey: "",
    order: 0,
    folder: "",
    fr: "",
    ar: "",
    en: "",
  });

  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const q = query(collection(db, "creativeCategories"), orderBy("order"));
      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setCategories(list);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      labelKey: "",
      order: 0,
      folder: "",
      fr: "",
      ar: "",
      en: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!formData.labelKey.trim() || !formData.folder.trim()) {
      alert("Please fill all fields.");
      return;
    }

    setSaving(true);

    const payload = {
      labelKey: formData.labelKey.trim(),
      order: Number(formData.order), // ✅ FIXED HERE
      folder: formData.folder.trim().toLowerCase(),
      title: {
        fr: formData.fr,
        ar: formData.ar,
        en: formData.en,
      },
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "creativeCategories", editingId), payload);
      } else {
        await addDoc(collection(db, "creativeCategories"), payload);
      }

      await fetchCategories();
      resetForm();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Error saving category.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat: CreativeCategory) => {
    setFormData({
      labelKey: cat.labelKey,
      order: cat.order,
      folder: cat.folder,
      fr: cat.title?.fr || "",
      ar: cat.title?.ar || "",
      en: cat.title?.en || "",
    });

    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteDoc(doc(db, "creativeCategories", id));
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Error deleting category.");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Creative Categories</h1>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <div className="bg-white border rounded-2xl p-6 text-center text-gray-500">
          No categories yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border p-4 rounded flex justify-between items-center bg-white"
            >
              <div>
                <p className="text-sm text-gray-500">
                  Order: <b>{cat.order}</b>
                </p>

                <p className="font-semibold mt-1 text-lg">
                  {cat.title?.fr || cat.labelKey}
                </p>

                <p className="text-sm text-gray-700 flex items-center gap-1 mt-1">
                  <Folder size={14} /> Folder: <b>{cat.folder}</b>
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <button onClick={() => handleEdit(cat)}>
                  <Edit2 className="text-blue-600" />
                </button>

                <button onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="text-red-600" />
                </button>

                <button
                  onClick={() => navigate(`/creatives/${cat.folder}/videos`)}
                  className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded text-sm"
                >
                  <Video size={14} /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="mt-6 border p-6 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Category" : "Add Category"}
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Label key"
              className="border p-2 rounded"
              value={formData.labelKey}
              onChange={(e) => setFormData({ ...formData, labelKey: e.target.value })}
            />

            <input
              type="number"
              placeholder="Order"
              className="border p-2 rounded"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number(e.target.value) }) // ✅ FIXED HERE TOO
              }
            />

            <input
              type="text"
              placeholder="Folder"
              className="border p-2 rounded"
              value={formData.folder}
              onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
            />

            <input
              type="text"
              placeholder="Title (FR)"
              className="border p-2 rounded"
              value={formData.fr}
              onChange={(e) => setFormData({ ...formData, fr: e.target.value })}
            />

            <input
              type="text"
              placeholder="Title (AR)"
              className="border p-2 rounded"
              value={formData.ar}
              onChange={(e) => setFormData({ ...formData, ar: e.target.value })}
            />

            <input
              type="text"
              placeholder="Title (EN)"
              className="border p-2 rounded"
              value={formData.en}
              onChange={(e) => setFormData({ ...formData, en: e.target.value })}
            />

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Creatives;