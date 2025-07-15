import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Upload, Download } from 'lucide-react';
import { useLibraryData } from '../hooks/useLibraryData';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import BulkImport from '../components/BulkImport';

const Books = () => {
  const { books, authors, categories, deleteBook, bulkImportBooks } = useLibraryData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [showBulkImport, setShowBulkImport] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        deleteBook(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete book');
      }
    }
  };

  const filteredBooks = books
  .filter(book => {
    const title = book.title || '';
    const author = book.authorName || '';
    const term = searchTerm.toLowerCase();

    return title.toLowerCase().includes(term) || author.toLowerCase().includes(term);
  })
    .filter(book => filterCategory === '' || book.categoryName === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title ?? '').localeCompare(b.title ?? '');
        case 'author':
          return (a.authorName ?? '').localeCompare(b.authorName ?? '');
        case 'price':
          return (a.price ?? 0) - (b.price ?? 0);
        case 'publishedDate':
          return new Date(b.publishedDate ?? 0).getTime() - new Date(a.publishedDate ?? 0).getTime();
        default:
          return 0;
  }
});


  const categoryNames = Array.from(new Set(books.map(book => book.categoryName)));

  const handleExport = (format: 'csv' | 'json') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `books_${timestamp}.${format}`;
    
    if (format === 'csv') {
      exportToCSV(books, filename);
    } else {
      exportToJSON(books, filename);
    }
  };

  const getImportTemplate = () => {
    return [{
      title: 'Sample Book Title',
      description: 'Sample book description',
      authorId: authors[0]?.id || '1',
      categoryId: categories[0]?.id || '1',
      publishedDate: '2024-01-01',
      price: 29.99
    }];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Books</h1>
          <p className="text-gray-600 mt-2">Manage your book collection</p>
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
          
          <button
            onClick={() => setShowBulkImport(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Bulk Import</span>
          </button>
          
          <Link
            to="/books/new"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Book</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent">
              <option value="">All Categories</option>
              {categoryNames.map((category, index) => (
                <option key={`${category}-${index}`} value={category}>{category}</option>
              ))}
            </select>

            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="price">Sort by Price</option>
              <option value="publishedDate">Sort by Date</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-black">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-black">Author</th>
                <th className="text-left py-3 px-4 font-semibold text-black">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-black">Published</th>
                <th className="text-left py-3 px-4 font-semibold text-black">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={book.id ?? `book-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-black">{book.title}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xs">{book.description}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{book.authorName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {book.categoryName}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-900">${(book.price ?? 0).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-600 hover:text-black transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/books/edit/${book.id}`}
                        className="p-1 text-gray-600 hover:text-black transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No books found matching your criteria.
          </div>
        )}
      </div>

      <BulkImport
        isOpen={showBulkImport}
        onClose={() => setShowBulkImport(false)}
        onImport={bulkImportBooks}
        templateData={getImportTemplate()}
        entityName="Books"
      />
    </div>
  );
};

export default Books;