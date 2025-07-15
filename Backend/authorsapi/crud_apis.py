from .models import Author, AuthorCreate
from fastapi import APIRouter, HTTPException
from db import authors_table
import json
from tinydb import Query

from datetime import datetime



router = APIRouter()

# POST method to create an author
@router.post("/authors/")
def create_author(author: AuthorCreate):
    author_dict = json.loads(author.model_dump_json())

    # Add extra fields
    now = datetime.utcnow().date()
    author_dict["created_at"] = now.isoformat()
    author_dict["updated_at"] = now.isoformat()
    author_dict["average_rating"] = 0.0
    author_dict["book_count"] = 0
    author_dict["books"] = []
    all_authors = authors_table.all()
    max_id = max([a.get("author_id", 0) for a in all_authors], default=0)
    author_dict["author_id"] = max_id + 1

    authors_table.insert(author_dict)
    return author_dict


# GET method to retrieve all authors
@router.get("/authors/")
def get_all_author():
    return authors_table.all()


# GET method to retrieve a specific author by ID
@router.get("/authors/{author_id}")
@router.get("/authors/{author_id}")
def get_author_by_id(author_id: int):
    AuthorQuery = Query()
    author = authors_table.get(AuthorQuery.author_id == author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author


# PUT method to Update an author by ID
@router.put("/authors/{author_id}")
def update_author(author_id: int, updated_author: AuthorCreate):
    AuthorQuery = Query()
    if not authors_table.contains(AuthorQuery.author_id == author_id):
        raise HTTPException(status_code=404, detail="Author not found")
    
    existing = authors_table.get(AuthorQuery.author_id == author_id)

    # Keep fields that shouldn't be overwritten
    updated_dict = json.loads(updated_author.model_dump_json())
    updated_dict["author_id"] = author_id
    updated_dict["created_at"] = existing["created_at"]
    updated_dict["updated_at"] = datetime.utcnow().date().isoformat()
    updated_dict["book_count"] = existing.get("book_count", 0)
    updated_dict["average_rating"] = existing.get("average_rating", 0.0)
    updated_dict["books"] = existing.get("books", [])

    authors_table.update(updated_dict, AuthorQuery.author_id == author_id)
    return updated_dict


# Delete author by ID
@router.delete("/authors/{author_id}")
def delete_author(author_id: int):
    AuthorQuery = Query()
    BookQuery = Query()

    author = authors_table.get(AuthorQuery.author_id == author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    # Safety check
    author_books = books_table.search(BookQuery.authorId == author_id)
    if author_books:
        raise HTTPException(status_code=400, detail="Cannot delete author with existing books")

    authors_table.remove(AuthorQuery.author_id == author_id)
    return {"message": f"Author with ID {author_id} deleted successfully."}