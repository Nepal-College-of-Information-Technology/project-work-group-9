from fastapi import FastAPI
from crud_apis import router

app = FastAPI()

app.include_router(app)
