from fastapi import APIRouter, HTTPException
from db import authors_table
from statistics import mean

router3 = APIRouter()

# Get all books by author
@router3.get("/authors/{author_id}/books")
def get_books_by_author(author_id: int):
    AuthorQuery = Query()
    author = authors_table.get(AuthorQuery.author_id == author_id)
    if author:
        return {"author": f"{author['first_name']} {author['last_name']}", "books": author["books"]}
    raise HTTPException(status_code=404, detail="Author not found")


# Get author and book summary
@router3.get("/authors/{author_id}/summary")
def get_author_summary(author_id: int):
    AuthorQuery = Query()
    author = authors_table.get(AuthorQuery.author_id == author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    
    return {
        "author_id": author_id,
        "name": f"{author['first_name']} {author['last_name']}",
        "age": author.get("age"),
        "number_of_books": len(author.get("books", [])),
        "books": author.get("books", [])
    }


# Get author ratings
@router3.get("/authors/{author_id}/statistics")
def get_author_statistics(author_id: int):
    AuthorQuery = Query()
    author = authors_table.get(AuthorQuery.author_id == author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    books = author.get("books", [])
    book_count = len(books)

    ratings = [book.get("rating") for book in books if book.get("rating") is not None]

    avg_rating = mean(ratings) if ratings else None

    return {
        "author_id": author_id,
        "name": f"{author['first_name']} {author['last_name']}",
        "book_count": book_count,
        "average_rating": avg_rating
    }
