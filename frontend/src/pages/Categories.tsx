import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Book, Download } from 'lucide-react';
import { useLibraryData } from '../hooks/useLibraryData';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

const Categories = () => {
  const { categories, deleteCategory } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        deleteCategory(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete category');
      }
    }
  };

  const filteredCategories = (categories ?? []).filter(cat => {
  if (!cat) return false;
  const name = cat.name ?? '';
  const term = searchTerm ?? '';
  return name.toLowerCase().includes(term.toLowerCase());
});



  const handleExport = (format: 'csv' | 'json') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `categories_${timestamp}.${format}`;
    
    if (format === 'csv') {
      exportToCSV(categories, filename);
    } else {
      exportToJSON(categories, filename);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Categories</h1>
          <p className="text-gray-600 mt-2">Manage book categories</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>JSON</span>
            </button>
          </div>
          
          <Link
            to="/categories/new"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">{category.name}</h3>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/categories/edit/${category.id}`}
                    className="p-1 text-gray-600 hover:text-black transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Book className="h-4 w-4 mr-1" />
                <span>{category.bookCount} {category.bookCount === 1 ? 'book' : 'books'}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No categories found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;