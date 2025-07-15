from authorsapi.models import Categories
from authorsapi.models import Book, BookCreate
from authorsapi.models import Author
from fastapi import APIRouter, HTTPException, Query as QueryParam
from db import categories_table
from db import books_table
from db import authors_table
import json
from tinydb import Query
from datetime import datetime, date, timedelta
from typing import Optional
import json
from fastapi.responses import JSONResponse
from fastapi import Response, status


router6 = APIRouter()
BooksQuery=Query()
CategoryQuery=Query()

@router6.post("/books", status_code=201)
def create_book(book: BookCreate):
    # You can print here to debug:
    print("Received book:", book)
    
    # Simulate DB lookup or validation
    # e.g. verify author_id exists in authors_table
    author = authors_table.get(Query().author_id == book.author_id)
    if not author:
        raise HTTPException(status_code=400, detail="Author not found")
    
    category = categories_table.get(Query().id == book.category_id)
    if not category:
        raise HTTPException(status_code=400, detail="Category not found")

    book_dict = book.model_dump()
    # Assign new ID or other fields as needed
    all_books = books_table.all()
    max_id = max([b.get("id", 0) for b in all_books], default=0)
    book_dict['id'] = max_id + 1

    # Convert date to string for storage if needed
    book_dict['publication_date'] = book.publication_date.isoformat()

    books_table.insert(book_dict)
    return JSONResponse(content=book_dict, status_code=201)

@router6.get('/books')
def get_all_books():
    books = books_table.all()
    return JSONResponse(content=books)

@router6.get('/books/{book_id}')
def get_book_by_id(book_id: int):
    book = books_table.get(BooksQuery.id == book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return JSONResponse(content=book)


@router6.put('/books/{book_id}')
def update_book(book_id: int, book: BookCreate):
    existing = books_table.get(BooksQuery.id == book_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Book not found")

    book_dict = json.loads(book.model_dump_json())
    books_table.update(book_dict, BooksQuery.id == book_id)
    updated_book = books_table.get(BooksQuery.id == book_id)
    return JSONResponse(content=updated_book)

@router6.delete('/books/{book_id}')
def delete_book(book_id: int):
    existing = books_table.get(BooksQuery.id == book_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Book not found")
    books_table.remove(BooksQuery.id == book_id)
    return JSONResponse(content={"message": "Book deleted successfully"})




