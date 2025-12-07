import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Camera, Palette, Globe2, DollarSign, Share2, ArrowRight } from 'lucide-react';

interface Stats {
  creativeCategories: number;
  designSections: number;
  devThemeCategories: number;
  sponsoringVideos: number;
  socialVideos: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    creativeCategories: 0,
    designSections: 0,
    devThemeCategories: 0,
    sponsoringVideos: 0,
    socialVideos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          creativeCategoriesSnap,
          designSectionsSnap,
          devThemeCategoriesSnap,
          sponsoringVideosSnap,
          socialVideosSnap,
        ] = await Promise.all([
          getDocs(collection(db, 'creativeCategories')),
          getDocs(collection(db, 'designSections')),
          getDocs(collection(db, 'devThemeCategories')),
          getDocs(collection(db, 'sponsoringVideos')),
          getDocs(collection(db, 'socialVideos')),
        ]);

        setStats({
          creativeCategories: creativeCategoriesSnap.size,
          designSections: designSectionsSnap.size,
          devThemeCategories: devThemeCategoriesSnap.size,
          sponsoringVideos: sponsoringVideosSnap.size,
          socialVideos: socialVideosSnap.size,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Creative Categories',
      value: stats.creativeCategories,
      icon: Camera,
      color: 'from-blue-500 to-blue-600',
      link: '/creatives',
    },
    {
      title: 'Design Sections',
      value: stats.designSections,
      icon: Palette,
      color: 'from-purple-500 to-purple-600',
      link: '/design',
    },
    {
      title: 'Dev Theme Categories',
      value: stats.devThemeCategories,
      icon: Globe2,
      color: 'from-green-500 to-green-600',
      link: '/dev-themes',
    },
    {
      title: 'Sponsoring Videos',
      value: stats.sponsoringVideos,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      link: '/sponsoring',
    },
    {
      title: 'Social Videos',
      value: stats.socialVideos,
      icon: Share2,
      color: 'from-pink-500 to-pink-600',
      link: '/social',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your content management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Hizou Panel</h2>
        <p className="text-white/90 mb-4">
          Manage all your creative content, design portfolios, dev themes, and social media in one place.
        </p>
        <div className="flex gap-4">
          <Link
            to="/creatives"
            className="bg-white text-primary px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Manage Content
          </Link>
          <Link
            to="/settings"
            className="bg-white/20 text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/30 transition"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
