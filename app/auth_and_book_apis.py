from fastapi import APIRouter, HTTPException
from models import Author
from db import authors_table
from statistics import mean

router = APIRouter()

# Get all books by author
@router.get("/authors/{author_id}/books")
def get_books_by_author(author_id: int):
    author = authors_table.get(doc_id=author_id)
    if author:
        return {"author": author["name"], "books": author["books"]}
    raise HTTPException(status_code=404, detail="Author not found")

# Get author and book summary
@router.get("/authors/{author_id}/summary")
def get_author_summary(author_id: int):
    author = authors_table.get(doc_id=author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    return {
        "author_id": author_id,
        "name": author["name"],
        "age": author["age"],
        "number_of_books": len(author["books"]),
        "books": author["books"]
    }

# Get author ratings
@router.get("/authors/{author_id}/statistics")
def get_author_statistics(author_id: int):
    author = authors_table.get(doc_id=author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    books = author.get("books", [])
    book_count = len(books)

    ratings = [book.get("rating") for book in books if book.get("rating") is not None]

    avg_rating = mean(ratings) if ratings else None

    return {
        "author_id": author_id,
        "name": author["name"],
        "book_count": book_count,
        "average_rating": avg_rating
    }