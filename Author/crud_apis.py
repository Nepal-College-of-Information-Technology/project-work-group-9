from models import Author
from fastapi import APIRouter, HTTPException
from db import authors_table

router = APIRouter()

# POST method to create an author
@router.post("/authors/")
def create_author(author: Author):
    author_dict = author.__dict__()
    author_id = authors_table.insert(author_dict)
    return {"author_id": author_id, **author_dict}


# GET method to retrieve all authors
@router.get("/authors/")
def get_author():
    return authors_table.all()


# GET method to retrieve a specific author by ID
@router.get("/authors/{author_id}")
def get_author_by_id(author_id: int):
    author = authors_table.get(doc_id=author_id)
    if author:
        return author
    else:
        raise HTTPException(status_code=404, detail="Author not found")

# PUT method to Update an author by ID
@router.put("/authors/{author_id}")
def update_author(author_id: int, updated_author: Author):
    if authors_table.contains(doc_id=author_id):
        authors_table.update(updated_author.__dict__dict(), doc_ids=[author_id])
        return {"author_id": author_id, **updated_author.__dict__()}
    else:
        raise HTTPException(status_code=404, detail="Author not found")


