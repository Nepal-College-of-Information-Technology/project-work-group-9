from models import Author
from fastapi import APIRouter, HTTPException
from db import authors_table
import json
from tinydb import Query


router = APIRouter()

# POST method to create an author
@router.post("/authors/")
def create_author(author: Author):
    author_dict = json.loads(author.model_dump_json())
    author_id = authors_table.insert(author_dict)
    return {"author_id": author_id, **author_dict}


# GET method to retrieve all authors
@router.get("/authors/")
def get_all_author():
    return authors_table.all()


# GET method to retrieve a specific author by ID
@router.get("/authors/{author_id}")
def get_author_by_id(author_id: int):
    AuthorQuery = Query()
    author = authors_table.get(AuthorQuery.author_id == author_id)
    if author:
        return author
    else:
        raise HTTPException(status_code=404, detail="Author not found")


# PUT method to Update an author by ID
@router.put("/authors/{author_id}")
def update_author(author_id: int, updated_author: Author):
    AuthorQuery = Query()
    if authors_table.contains(AuthorQuery.author_id == author_id):
        authors_table.update(updated_author.dict(), AuthorQuery.author_id == author_id)
        return {"author_id": author_id, **updated_author.dict()}
    else:
        raise HTTPException(status_code=404, detail="Author not found")


# Delete author by ID
@router.delete("/authors/{author_id}")
def delete_author(author_id: int):
    AuthorQuery = Query()
    author = authors_table.get(AuthorQuery.author_id == author_id)
    
    if author:
        authors_table.remove(AuthorQuery.author_id == author_id)
        return {"message": f"Author with ID {author_id} deleted successfully."}
    
    raise HTTPException(status_code=404, detail="Author not found")