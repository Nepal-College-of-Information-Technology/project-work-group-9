from app.models import Categories
from app.models import Book
from fastapi import APIRouter, HTTPException, Query as QueryParam
from app.db import categories_table
from app.db import books_table
import json
from tinydb import Query
from datetime import datetime, date, timedelta
from typing import Optional


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


# Get books by author
@router6.get('/books/author/{author_id}')
def get_books_by_author(author_id: int):
    books = books_table.search(BooksQuery.author_id == author_id)
    return {
        "author_id": author_id,
        "books": books,
        "count": len(books)
    }, 200


# Search books by title (like query)
@router6.get('/books/search')
def search_books_by_title(q: str = QueryParam(..., description="Search query for book title")):
    books = books_table.search(BooksQuery.title.matches(f'.*{q}.*', flags=2))  # Case insensitive
    return {
        "query": q,
        "results": books,
        "count": len(books)
    }, 200



# Get recent books (published last 30 days)
@router6.get('/books/recent')
def get_recent_books():
    thirty_days_ago = (date.today() - timedelta(days=30)).isoformat()
    books = books_table.search(BooksQuery.publication_date >= thirty_days_ago)
    return {
        "books": books,
        "count": len(books),
        "date_range": f"Last 30 days from {date.today().isoformat()}"
    }, 200


# Get books sorted by price
@router6.get('/books/sorted-by-price')
def get_books_sorted_by_price(order: str = QueryParam("asc", regex="^(asc|desc)$")):
    books = books_table.all()
    reverse = order == "desc"
    sorted_books = sorted(books, key=lambda x: x.get('price', 0), reverse=reverse)
    return {
        "books": sorted_books,
        "sort_order": order,
        "count": len(sorted_books)
    }, 200


# Get books with price between range
@router6.get('/books/price-range')
def get_books_by_price_range(
    min_price: float = QueryParam(..., ge=0, description="Minimum price"),
    max_price: float = QueryParam(..., ge=0, description="Maximum price")
):
    if min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price cannot be greater than max_price")
    
    books = books_table.search(
        (BooksQuery.price >= min_price) & (BooksQuery.price <= max_price)
    )
    return {
        "books": books,
        "price_range": f"{min_price} - {max_price}",
        "count": len(books)
    }, 200


# Count total number of books
@router6.get('/books/count')
def count_total_books():
    all_books = books_table.all()
    total_books = len(all_books)
    
    # Count books by category
    category_counts = {}
    for book in all_books:
        category_id = book.get('category_id')
        if category_id:
            category_counts[category_id] = category_counts.get(category_id, 0) + 1
    
    # Count books by author
    author_counts = {}
    for book in all_books:
        author_id = book.get('author_id')
        if author_id:
            author_counts[author_id] = author_counts.get(author_id, 0) + 1
    
    books_by_category = [
        {"category_id": cat_id, "count": count}
        for cat_id, count in category_counts.items()
    ]
    
    books_by_author = [
        {"author_id": author_id, "count": count}
        for author_id, count in author_counts.items()
    ]
    
    return {
        "total_books": total_books,
        "books_by_category": books_by_category,
        "books_by_author": books_by_author
    }, 200










