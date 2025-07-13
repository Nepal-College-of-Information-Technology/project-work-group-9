from app.models import Categories
from app.models import Book
from fastapi import APIRouter, HTTPException
from app.db import categories_table
from app.db import books_table
import json
from tinydb import Query

router6 = APIRouter()
BooksQuery=Query()

@router6.get('/books')
def get_all_books():
    books = books_table.all()
    return books, 200


# Create a book
@router6.post('/books', status_code=201)
def create_book(book: Book):
    existing = books_table.get(BooksQuery.id == book.id)
    if existing:
        raise HTTPException(status_code=400, detail="Book ID already exists")
    book_dict = json.loads(book.model_dump_json())
    book_id = books_table.insert(book_dict)
    return {**book_dict, "id": book_id}


# Get book by ID
@router6.get('/books/{book_id}')
def get_book_by_id(book_id: int):
    book = books_table.get(BooksQuery.id == book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book, 200


# Update book
@router6.put('/books/{book_id}')
def update_book(book_id: int, book: Book):
    existing = books_table.get(BooksQuery.id == book_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if new ID conflicts with existing books (if ID is being changed)
    if book.id != book_id:
        id_conflict = books_table.get(BooksQuery.id == book.id)
        if id_conflict:
            raise HTTPException(status_code=400, detail="Book ID already exists")
    
    book_dict = json.loads(book.model_dump_json())
    books_table.update(book_dict, BooksQuery.id == book_id)
    updated_book = books_table.get(BooksQuery.id == book.id)
    return updated_book, 200


# Delete book
@router6.delete('/books/{book_id}')
def delete_book(book_id: int):
    existing = books_table.get(BooksQuery.id == book_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Book not found")
    
    books_table.remove(BooksQuery.id == book_id)
    return {"message": "Book deleted successfully"}, 200


# Get books by category
@router6.get('/books/category/{category_id}')
def get_books_by_category(category_id: int):
    books = books_table.search(BooksQuery.category_id == category_id)
    return {
        "category_id": category_id,
        "books": books,
        "count": len(books)
    }, 200







