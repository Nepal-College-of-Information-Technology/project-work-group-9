import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useLibraryData } from '../hooks/useLibraryData';

interface AuthorFormData {
  name: string;
  bio: string;
}

const AuthorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { authors, addAuthor, updateAuthor } = useLibraryData();

  const [formData, setFormData] = useState<AuthorFormData>({
    name: '',
    bio: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AuthorFormData>>({});

  useEffect(() => {
    if (isEdit && id) {
      const author = authors.find(a => a.id === id);
      if (author) {
        setFormData({
          name: author.name,
          bio: author.bio,
        });
      }
    }
  }, [isEdit, id]);

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthorFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEdit) {
        updateAuthor(id!, formData);
      } else {
        addAuthor(formData);
      }

      navigate('/authors');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save author');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AuthorFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/authors')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-black">
            {isEdit ? 'Edit Author' : 'Add New Author'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update author information' : 'Enter author details'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter author name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                errors.bio ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter author bio"
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : isEdit ? 'Update Author' : 'Create Author'}</span>
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/authors')}
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

export default AuthorForm;