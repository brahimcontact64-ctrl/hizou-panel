import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Save } from 'lucide-react';

interface TextOverrides {
  [key: string]: {
    fr?: string;
    ar?: string;
  };
}

export default function Settings() {
  const [overrides, setOverrides] = useState<TextOverrides>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const translationKeys = [
    'projects.title',
    'projects.subtitle',
    'projects.creatives.title',
    'projects.creatives.description',
    'design.title',
    'projects.dev.title',
    'projects.sponsoring.title',
    'projects.sponsoring.sponsors',
    'projects.sponsoring.videos',
    'projects.social.title',
    'projects.social.description',
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'projects_page');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOverrides(docSnap.data() as TextOverrides);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'projects_page'), overrides);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const updateOverride = (key: string, lang: 'fr' | 'ar', value: string) => {
    setOverrides(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value
      }
    }));
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
          <h1 className="text-2xl font-bold text-gray-900">Text Settings</h1>
          <p className="text-gray-600">Override translation texts for the Projects page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        {translationKeys.map((key) => (
          <div key={key} className="pb-6 border-b border-gray-200 last:border-b-0">
            <h3 className="font-semibold text-gray-900 mb-3">{key}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">French</label>
                <input
                  type="text"
                  value={overrides[key]?.fr || ''}
                  onChange={(e) => updateOverride(key, 'fr', e.target.value)}
                  placeholder="Leave empty to use default translation"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arabic</label>
                <input
                  type="text"
                  value={overrides[key]?.ar || ''}
                  onChange={(e) => updateOverride(key, 'ar', e.target.value)}
                  placeholder="اترك فارغًا لاستخدام الترجمة الافتراضية"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Leave fields empty to use the default translations from your i18n files.
          Only fill in values you want to override.
        </p>
      </div>
    </div>
  );
}
