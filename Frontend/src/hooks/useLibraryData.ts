import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api-client';

export interface Book {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName?: string;   // optional if you want to keep the original shape
  categoryId: string;
  categoryName?: string;
  publication_date: string;
  price: number;
}


export interface BookCreate {
  title: string;
  description: string;
  author_id: number;
  category_id: number;
  publication_date: string; // backend expects this format
  price: number;
}


export interface Author {
  id: string;  // add this field explicitly
  first_name: string;
  last_name: string;
  name: string;  // derived field
  bio: string;
  date_of_birth: string;
  date_of_death: string | null;
  nationality: string;
  created_at: string;
  updated_at: string;
  average_rating: number;
  book_count: number;
  books: any[];  // or your Book[] type if defined
}


export interface AuthorCreateInput {
  name: string; // Full name from UI (e.g. "Jane Austen")
  bio: string;
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

const getAuthorFullName = (author?: Author) => {
  if (!author) return '';
  return `${author.first_name} ${author.last_name}`.trim();
};

const transformCategory = (backendCategory: any): Category => ({
  id: String(backendCategory.id),
  name: backendCategory.name,
  bookCount: backendCategory.bookCount || 0,
});

const transformAuthor = (data: any): Author => ({
  id: data.author_id.toString(), // convert int to string if needed
  first_name: data.first_name,
  last_name: data.last_name,
  name: `${data.first_name} ${data.last_name}`,
  bio: data.bio,
  date_of_birth: data.date_of_birth,
  date_of_death: data.date_of_death,
  nationality: data.nationality,
  created_at: data.created_at,
  updated_at: data.updated_at,
  average_rating: data.average_rating,
  book_count: data.book_count,
  books: data.books || [],
});





const transformBook = (backendBook: any, authors: Author[], categories: Category[]): Book => {
  const author = authors.find(a => a.id === String(backendBook.author_id));
  const category = categories.find(c => c.id === String(backendBook.category_id));

  return {
    id: String(backendBook.id),
    title: backendBook.title,
    description: backendBook.description,
    authorId: String(backendBook.author_id),
    authorName: author ? `${author.first_name} ${author.last_name}`.trim() : '',
    categoryId: String(backendBook.category_id),
    categoryName: category?.name || '',
    publication_date: backendBook.published_date,
    price: backendBook.price,
  };
};


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

      const transformedAuthors = authorsRes.data.map(transformAuthor);
      const transformedCategories = categoriesRes.data.map(transformCategory);

      setAuthors(transformedAuthors);
      setCategories(transformedCategories);

      const transformedBooks = booksRes.data.map((backendBook: any) =>
        transformBook(backendBook, transformedAuthors, transformedCategories)
      );

      setBooks(transformedBooks);
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

// Wrapper function to be called from your UI form handler
const addBookByName = async (bookData: {
  title: string;
  description: string;
  authorName: string;
  categoryName: string;
  publication_date: string;
  price: number;
}) => {
  const authorObj = authors.find(
    a => a.name.toLowerCase() === bookData.authorName.trim().toLowerCase()
  );
  if (!authorObj) throw new Error(`Author "${bookData.authorName}" not found`);

  const categoryObj = categories.find(
    c => c.name.toLowerCase() === bookData.categoryName.trim().toLowerCase()
  );
  if (!categoryObj) throw new Error(`Category "${bookData.categoryName}" not found`);

  // Now call existing addBook with IDs
  return await addBook({
    title: bookData.title,
    description: bookData.description,
    author_id: Number(authorObj.id),
    category_id: Number(categoryObj.id),
    publication_date: bookData.publication_date,
    price: bookData.price,
  });
};

 
  // addBook with API call
const addBook = async (bookData: {
  title: string;
  description: string;
  author_id: number;   // <-- pass the ID directly
  category_id: number;
  publication_date: string;
  price: number;
}) => {
  if (!bookData.author_id) {
    throw new Error('Author ID is required and cannot be undefined');
  }

  // No need to lookup author by name here, just use ID
  const authorObj = authors.find(a => a.id === String(bookData.author_id));
  if (!authorObj) throw new Error(`Author ID ${bookData.author_id} not found`);

  
  // Similar for category_id
  const categoryObj = categories.find(c => c.id === String(bookData.category_id));
  if (!categoryObj) throw new Error(`Category ID ${bookData.category_id} not found`);

  const payload = {
  title: bookData.title,
  description: bookData.description,
  author_id: bookData.author_id,
  category_id: bookData.category_id,
  publication_date: bookData.publication_date, 
  price: bookData.price,
};


  console.log("Sending book to backend:", payload);

  const response = await apiClient.post('/books', payload);

  // Transform response to Book shape with author and category names included
  const newBook: Book = {
    id: String(response.data.id),
    title: response.data.title,
    description: response.data.description,
    authorId: String(response.data.author_id),
    authorName: `${authorObj.first_name} ${authorObj.last_name}`.trim(),
    categoryId: String(response.data.category_id),
    categoryName: categoryObj.name,
    publication_date: response.data.publication_date,
    price: response.data.price,
  };

  setBooks(prev => [...prev, newBook]);
  return newBook;
};



  const updateBook = async (id: string, bookData: Partial<BookCreate>) => {
    const response = await apiClient.put(`/books/${id}`, { ...bookData, id: Number(id) });
    const updatedBook = {
      id: String(response.data.id),
      title: response.data.title,
      description: response.data.description,
      authorId: String(response.data.author_id),
      categoryId: String(response.data.category_id),
      publishedDate: response.data.publication_date,
      price: response.data.price,
    };
    setBooks(prev => prev.map(book => (book.id === id ? updatedBook : book)));
    return updatedBook;
  };

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
      const newBook: Book = {
        ...response.data,
        authorName: author.name,
        categoryName: category.name,
      };
      imported.push(newBook);
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
  const addAuthor = async (authorData: AuthorCreateInput): Promise<Author> => {
  const payload = {
    name: authorData.name.trim(),
    bio: authorData.bio,
  };

  const response = await apiClient.post('/authors/', payload);
  const newAuthor = transformAuthor(response.data);

  setAuthors(prev => [...prev, newAuthor]);
  return newAuthor;
};




  const updateAuthor = async (id: string, authorData: AuthorCreateInput): Promise<Author> => {
  const payload = {
    name: authorData.name.trim(),
    bio: authorData.bio,
  };

  const response = await apiClient.put(`/authors/${id}`, payload);
  const updatedAuthor = transformAuthor(response.data);

  setAuthors(prev =>
    prev.map(author => (author.id === id ? updatedAuthor : author))
  );

  // Update related books' authorName
  const fullName = `${updatedAuthor.first_name} ${updatedAuthor.last_name}`.trim();
  setBooks(prev =>
    prev.map(book =>
      book.authorId === id ? { ...book, authorName: fullName } : book
    )
  );

  return updatedAuthor;
};



  const deleteAuthor = async (id: string) => {
  const hasBooks = books.some(book => book.authorId === id);
  if (hasBooks) {
    throw new Error('Cannot delete author with existing books');
  }

  await apiClient.delete(`/authors/${id}`);
  setAuthors(prev => prev.filter(author => author.id !== id));
};


  // Category operations
  const addCategory = async (categoryData: Omit<Category, 'id' | 'bookCount'>) => {
  const response = await apiClient.post('/categories', categoryData);
  const newCategory = transformCategory(response.data);
  setCategories(prev => [...prev, newCategory]);
  return newCategory;
};

  const updateCategory = async (id: string, categoryData: Omit<Category, 'id' | 'bookCount'>) => {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    const updatedCategory = transformCategory(response.data);  // transform here
    setCategories(prev => prev.map(category => (category.id === id ? updatedCategory : category)));

    // Update category names in books
    const updatedBooks = books.map(book =>
      book.categoryId === id ? { ...book, categoryName: updatedCategory.name } : book
    );
    setBooks(updatedBooks);
    return updatedCategory;

  };

  const deleteCategory = async (id: string) => {
    const hasBooks = books.some(book => book.categoryId === id);
    if (hasBooks) {
      throw new Error('Cannot delete category with existing books');
    }

    await apiClient.delete(`/categories/${id}`);
    setCategories(prev => prev.filter(category => category.id !== id));
  };


    const getStats = () => {
    const totalBooks = books.length;
    const totalAuthors = authors.length;
    const totalCategories = categories.length;
    const recentBooks = books.filter(b => new Date(b.publication_date) > new Date('2024-01-01')).length;
    const averagePrice = books.reduce((acc, b) => acc + b.price, 0) / (books.length || 1);
    const totalValue = books.reduce((acc, b) => acc + b.price, 0);

    return {
      totalBooks,
      totalAuthors,
      totalCategories,
      recentBooks,
      averagePrice,
      totalValue,
    };
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
    deleteCategory,
  };
};