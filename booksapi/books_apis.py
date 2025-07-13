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





