from fastapi import FastAPI
from crud_apis import router
from filter_and_search_apis import router2
from auth_and_book_apis import router3

app = FastAPI()

app.include_router(router)
app.include_router(router2)
app.include_router(router3)