import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api-client';

export interface Book {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  categoryName: string;
  publishedDate: string;
  price: number;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  bookCount: number;
}

export interface Category {
  id: string;
  name: string;
  bookCount: number;
}

export interface LibraryStats {
  totalBooks: number;
  totalAuthors: number;
  totalCategories: number;
  recentBooks: number;
  averagePrice: number;
  totalValue: number;
}

// Simple in-memory storage (replace with actual API calls)
/*
let booksData: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    description: 'A handbook of agile software craftsmanship',
    authorId: '1',
    authorName: 'Robert C. Martin',
    categoryId: '1',
    categoryName: 'Programming',
    publishedDate: '2024-01-15',
    price: 45.99,
  },
  {
    id: '2',
    title: 'Design Patterns',
    description: 'Elements of reusable object-oriented software',
    authorId: '2',
    authorName: 'Gang of Four',
    categoryId: '1',
    categoryName: 'Programming',
    publishedDate: '2024-02-20',
    price: 52.99,
  }
];

let authorsData: Author[] = [
  { id: '1', name: 'Robert C. Martin', bio: 'Software engineer and author', bookCount: 1 },
  { id: '2', name: 'Gang of Four', bio: 'Software design pattern authors', bookCount: 1 }
];

let categoriesData: Category[] = [
  { id: '1', name: 'Programming', bookCount: 2 },
  { id: '2', name: 'Design', bookCount: 0 }
];
*/

export const useLibraryData = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        apiClient.get('/books'),
        apiClient.get('/authors'),
        apiClient.get('/categories'),
      ]);
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch library data:', error);
    }
  };

/*
  const updateCounts = () => {
    // Update author book counts
    const updatedAuthors = authorsData.map(author => ({
      ...author,
      bookCount: books.filter(book => book.authorId === author.id).length
    }));
    setAuthors(updatedAuthors);
    authorsData = updatedAuthors;

    // Update category book counts
    const updatedCategories = categoriesData.map(category => ({
      ...category,
      bookCount: books.filter(book => book.categoryId === category.id).length
    }));
    setCategories(updatedCategories);
    categoriesData = updatedCategories;
  };
  */

  const getStats = (): LibraryStats => {
    const totalBooks = books.length;
    const totalAuthors = authors.length;
    const totalCategories = categories.length;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBooks = books.filter(book => 
      new Date(book.publishedDate) >= thirtyDaysAgo
    ).length;

    const totalValue = books.reduce((sum, book) => sum + book.price, 0);
    const averagePrice = totalBooks > 0 ? totalValue / totalBooks : 0;

    return {
      totalBooks,
      totalAuthors,
      totalCategories,
      recentBooks,
      averagePrice,
      totalValue
    };
  };

  // addBook with API call
const addBook = async (bookData: Omit<Book, 'id' | 'authorName' | 'categoryName'>) => {
  const response = await apiClient.post('/books', bookData);
  const newBook: Book = response.data;
  setBooks(prev => [...prev, newBook]);
  return newBook;
};

// updateBook with API call
const updateBook = async (id: string, bookData: Omit<Book, 'id' | 'authorName' | 'categoryName'>) => {
  const response = await apiClient.put(`/books/${id}`, bookData);
  const updatedBook: Book = response.data;
  setBooks(prev => prev.map(book => (book.id === id ? updatedBook : book)));
};

// deleteBook with API call
const deleteBook = async (id: string) => {
  await apiClient.delete(`/books/${id}`);
  setBooks(prev => prev.filter(book => book.id !== id));
};

// bulkImportBooks (client-side validation only, then add via API)
const bulkImportBooks = async (importedBooks: Omit<Book, 'id' | 'authorName' | 'categoryName'>[]) => {
  const errors: string[] = [];
  const imported: Book[] = [];

  for (const [index, bookData] of importedBooks.entries()) {
    const author = authors.find(a => a.id === bookData.authorId);
    const category = categories.find(c => c.id === bookData.categoryId);

    if (!author) {
      errors.push(`Row ${index + 1}: Author ID ${bookData.authorId} not found`);
      continue;
    }
    if (!category) {
      errors.push(`Row ${index + 1}: Category ID ${bookData.categoryId} not found`);
      continue;
    }

    try {
      const response = await apiClient.post('/books', bookData);
      imported.push(response.data);
    } catch (error) {
      errors.push(`Row ${index + 1}: Failed to import book`);
    }
  }

  if (imported.length > 0) {
    setBooks(prev => [...prev, ...imported]);
  }

  return { imported: imported.length, errors };
};

  // Author operations
  const addAuthor = (authorData: Omit<Author, 'id' | 'bookCount'>) => {
    const newAuthor: Author = {
      ...authorData,
      id: Date.now().toString(),
      bookCount: 0
    };
    const updatedAuthors = [...authors, newAuthor];
    setAuthors(updatedAuthors);
    authorsData = updatedAuthors;
    return newAuthor;
  };

  const updateAuthor = (id: string, authorData: Omit<Author, 'id' | 'bookCount'>) => {
    const updatedAuthors = authors.map(author => 
      author.id === id ? { ...author, ...authorData } : author
    );
    setAuthors(updatedAuthors);
    authorsData = updatedAuthors;

    // Update author names in books
    const author = updatedAuthors.find(a => a.id === id);
    if (author) {
      const updatedBooks = books.map(book => 
        book.authorId === id ? { ...book, authorName: author.name } : book
      );
      setBooks(updatedBooks);
      booksData = updatedBooks;
    }
  };

  const deleteAuthor = (id: string) => {
    // Check if author has books
    const hasBooks = books.some(book => book.authorId === id);
    if (hasBooks) {
      throw new Error('Cannot delete author with existing books');
    }

    const updatedAuthors = authors.filter(author => author.id !== id);
    setAuthors(updatedAuthors);
    authorsData = updatedAuthors;
  };

  // Category operations
  const addCategory = (categoryData: Omit<Category, 'id' | 'bookCount'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      bookCount: 0
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    categoriesData = updatedCategories;
    return newCategory;
  };

  const updateCategory = (id: string, categoryData: Omit<Category, 'id' | 'bookCount'>) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, ...categoryData } : category
    );
    setCategories(updatedCategories);
    categoriesData = updatedCategories;

    // Update category names in books
    const category = updatedCategories.find(c => c.id === id);
    if (category) {
      const updatedBooks = books.map(book => 
        book.categoryId === id ? { ...book, categoryName: category.name } : book
      );
      setBooks(updatedBooks);
      booksData = updatedBooks;
    }
  };

  const deleteCategory = (id: string) => {
    // Check if category has books
    const hasBooks = books.some(book => book.categoryId === id);
    if (hasBooks) {
      throw new Error('Cannot delete category with existing books');
    }

    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    categoriesData = updatedCategories;
  };

  return {
    books,
    authors,
    categories,
    getStats,
    addBook,
    updateBook,
    deleteBook,
    bulkImportBooks,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    addCategory,
    updateCategory,
    deleteCategory
  };
};