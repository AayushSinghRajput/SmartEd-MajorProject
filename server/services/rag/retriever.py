from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

def get_relevant_docs(pdf_hash: str, query: str):
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vector_db = FAISS.load_local(
        f"vector_store/{pdf_hash}",
        embeddings,
        allow_dangerous_deserialization=True
    )

    return vector_db.similarity_search(query, k=2)
