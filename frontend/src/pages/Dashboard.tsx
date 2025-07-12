import React from 'react';
import { Book, Users, Folder, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useLibraryData } from '../hooks/useLibraryData';

const Dashboard = () => {
  const { books, authors, categories, getStats } = useLibraryData();
  const stats = getStats();

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      icon: Book,
      color: 'bg-blue-50 text-blue-600',
      change: `${stats.totalBooks} total`,
    },
    {
      title: 'Authors',
      value: stats.totalAuthors,
      icon: Users,
      color: 'bg-green-50 text-green-600',
      change: `${stats.totalAuthors} total`,
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Folder,
      color: 'bg-purple-50 text-purple-600',
      change: `${stats.totalCategories} total`,
    },
    {
      title: 'Recent Books',
      value: stats.recentBooks,
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600',
      change: 'last 30 days',
    },
  ];

  const valueCards = [
    {
      title: 'Average Price',
      value: `$${stats.averagePrice.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600',
      change: 'per book',
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600',
      change: 'collection value',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your library management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-black mt-2">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {valueCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-black mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {books.slice(0, 4).map((book, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-black">Book: {book.title}</p>
                  <p className="text-sm text-gray-600">by {book.authorName}</p>
                </div>
                <span className="text-xs text-gray-500">${book.price}</span>
              </div>
            ))}
            {books.length === 0 && (
              <p className="text-gray-500 text-center py-4">No books in library</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Popular Categories</h3>
          <div className="space-y-4">
            {categories
              .filter(cat => cat.bookCount > 0)
              .sort((a, b) => b.bookCount - a.bookCount)
              .slice(0, 5)
              .map((category, index) => {
                const maxBooks = Math.max(...categories.map(c => c.bookCount));
                const percentage = maxBooks > 0 ? (category.bookCount / maxBooks) * 100 : 0;
                return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-black">{category.name}</span>
                  <span className="text-sm text-gray-600">{category.bookCount} books</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
                );
              })}
            {categories.filter(cat => cat.bookCount > 0).length === 0 && (
              <p className="text-gray-500 text-center py-4">No categories with books</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;