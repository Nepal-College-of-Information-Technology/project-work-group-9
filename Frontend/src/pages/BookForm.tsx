import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useLibraryData } from '../hooks/useLibraryData';

interface BookFormData {
  title: string;
  description: string;
  authorId: string;
  categoryId: string;
  publishedDate: string;
  price: string;
}

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { books, authors, categories, addBook, updateBook } = useLibraryData();

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    authorId: '',
    categoryId: '',
    publishedDate: '',
    price: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<BookFormData>>({});

  useEffect(() => {
    if (isEdit && id) {
      const book = books.find(b => b.id === id);
      if (book) {
        setFormData({
          title: book.title,
          description: book.description,
          authorId: book.authorId,
          categoryId: book.categoryId,
          publishedDate: book.publication_date,
          price: book.price.toString(),
        });
      }
    }
  }, [isEdit, id, books]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BookFormData> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.authorId) newErrors.authorId = 'Author is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.publishedDate) newErrors.publishedDate = 'Published date is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Example: UI form submit handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  try {
    // Prepare book data using IDs directly from formData
    const bookData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      author_id: formData.authorId,
      category_id: formData.categoryId,
      publication_date: formData.publishedDate,
      price: Number(formData.price),
    };

    console.log(" Payload to send:", bookData);

    if (isEdit && id) {
      // Update book by ID
      await updateBook(id, bookData);
    } else {
      // Add new book
      await addBook(bookData);
    }

    navigate('/books');
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Failed to save book');
  } finally {
    setLoading(false);
  }
};



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof BookFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/books')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black">
            {isEdit ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update book information' : 'Enter book details'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter book title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter book description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <select
                id="authorId"
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.authorId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select an author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {errors.authorId && <p className="mt-1 text-sm text-red-600">{errors.authorId}</p>}
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.categoryId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
            </div>

            <div>
              <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 mb-2">
                Published Date *
              </label>
              <input
                type="date"
                id="publishedDate"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                  errors.publishedDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.publishedDate && <p className="mt-1 text-sm text-red-600">{errors.publishedDate}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : isEdit ? 'Update Book' : 'Create Book'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;