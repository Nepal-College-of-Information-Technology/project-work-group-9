from ..authorsapi.models import Categories
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from ..db import categories_table
from ..db import books_table
from ..db import authors_table
import csv
from io import StringIO
import io
from ..dtos.dtos import BookDetailDTO,UserLogin
import json
from tinydb import Query


router7 = APIRouter()
CategoryQuery=Query()
BookQuery=Query()


@router7.get("/utility/books/details", response_model=list[BookDetailDTO])
def get_book_details():
    details = []
    for book in books_table:
        author = next((a for a in authors_table if a["author_id"] == book["author_id"]), {})
        category = next((c for c in categories_table if c["id"] == book["category_id"]), {})
        details.append({
            "title": book["title"],
            "author": author.get("first_name", "Unknown"),
            "category": category.get("name", "Unknown")
        })
    return details

@router7.get("/books/export/csv")
def export_books_csv():
    books = get_book_details()
    
    if not books:
        return {"message": "No books to export"}

    output = StringIO()
    writer = csv.writer(output)

    # Define CSV headers
    headers = ["Title", "Author", "Category"]
    writer.writerow(headers)

    for book in books:
        row = [
            book.get("title", ""),
            book.get("author", ""),
            book.get("category", "")
        ]
        writer.writerow(row)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=books.csv"}
    )


@router7.get("/stats")
def get_stats():
    return {
        "total_books": len(books_table),
        "total_authors": len(authors_table),
        "total_categories": len(categories_table)
    }

@router7.get("/health")
def health_check():
    return {"status": "OK"}



@router7.post("/login")
def login(user: UserLogin):
    if user.username == "admin" and user.password == "password":
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid credentials")