from Author.models import Author
from fastapi import FastAPI, HTTPException
from db import authors_table

app = FastAPI()


# POST method to create an author
@app.post("/authors/")
def create_author(author: Author):
    author_dict = author.__dict__()
    author_id = authors_table.insert(author_dict)
    return {"author_id": author_id, **author_dict}


# GET method to retrieve all authors
@app.get("/authors/")
def get_author():
    return authors_table.all()


# GET method to retrieve a specific author by ID
@app.get("/authors/{author_id}")
def get_author(author_id: int):
    author = authors_table.get(doc_id=author_id)
    if author:
        return author
    else:
        raise HTTPException(status_code=404, detail="Author not found")

