from fastapi import APIRouter, HTTPException
from typing import List
from models import Author
from db import authors_table

# Add a bulk create authors
@router.post("/authors/bulk/")
def bulk_create_authors(authors: List[Author]):
    inserted_authors = []

    for author in authors:
        author_data = author.dict()
        doc_id = authors_table.insert(author_data)
        inserted_authors.append({"author_id": doc_id, **author_data})

    return {"inserted": inserted_authors}
