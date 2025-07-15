import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Book, Download } from 'lucide-react';
import { useLibraryData } from '../hooks/useLibraryData';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';

const Authors = () => {
  const { authors, deleteAuthor } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);


 const handleDelete = async (id: string) => {
  if (window.confirm('Are you sure you want to delete this author?')) {
    try {
      setDeletingId(id);
      await deleteAuthor(id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete author');
    } finally {
      setDeletingId(null);
    }
  }
};



  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = (format: 'csv' | 'json') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `authors_${timestamp}.${format}`;
    
    if (format === 'csv') {
      exportToCSV(authors, filename);
    } else {
      exportToJSON(authors, filename);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Authors</h1>
          <p className="text-gray-600 mt-2">Manage book authors</p>
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
            to="/authors/new"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Author</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => (
            <div key={author.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">{author.name}</h3>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/authors/edit/${author.id}`}
                    className="p-1 text-gray-600 hover:text-black transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{author.bio}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <Book className="h-4 w-4 mr-1" />
                <span>{author.bookCount} {author.bookCount === 1 ? 'book' : 'books'}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredAuthors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No authors found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Authors;