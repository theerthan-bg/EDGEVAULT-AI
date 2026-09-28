from pathlib import Path
import uuid

from fastembed import TextEmbedding
from qdrant_edge import (
    Distance,
    EdgeConfig,
    EdgeShard,
    EdgeVectorParams,
    Point,
    Query,
    QueryRequest,
    UpdateOperation,
)


# -----------------------------
# EDGEVAULT CONFIGURATION
# -----------------------------

MEMORY_DIR = "./data/semantic-memory"
VECTOR_NAME = "memory"
VECTOR_DIMENSION = 384

Path(MEMORY_DIR).mkdir(parents=True, exist_ok=True)


# -----------------------------
# EMBEDDING MODEL
# -----------------------------

embedding_model = TextEmbedding()


# -----------------------------
# QDRANT EDGE
# -----------------------------

config = EdgeConfig(
    vectors={
        VECTOR_NAME: EdgeVectorParams(
            size=VECTOR_DIMENSION,
            distance=Distance.Cosine,
        )
    }
)


# Create the local Edge shard
shard = EdgeShard.create(MEMORY_DIR, config)


# -----------------------------
# STORE MEMORY
# -----------------------------

def store_memory(text: str, category: str = "NORMAL"):
    """Convert text into an embedding and store it locally."""

    embedding = list(
        embedding_model.embed([text])
    )[0]

    memory_id = str(uuid.uuid4())

    point = Point(
        id=memory_id,
        vector={
            VECTOR_NAME: embedding.tolist()
        },
        payload={
            "text": text,
            "category": category,
        },
    )

    shard.update(
        UpdateOperation.upsert_points([point])
    )

    print("Memory stored successfully!")
    print(f"ID: {memory_id}")
    print(f"Category: {category}")
    print(f"Text: {text}")


# -----------------------------
# SEARCH MEMORY
# -----------------------------

def search_memory(query_text: str, limit: int = 3):
    """Search local memories using semantic similarity."""

    query_embedding = list(
        embedding_model.embed([query_text])
    )[0]

    results = shard.query(
        QueryRequest(
            query=Query.Nearest(
                query_embedding.tolist(),
                using=VECTOR_NAME,
            ),
            limit=limit,
            with_vector=False,
            with_payload=True,
        )
    )

    return results


# -----------------------------
# DEMO
# -----------------------------

if __name__ == "__main__":

    print("\n=== EDGEVAULT SEMANTIC MEMORY ===\n")

    store_memory(
        "Machine 07 experienced overheating during operation.",
        "NORMAL",
    )

    store_memory(
        "The cooling fan of Machine 07 was replaced last week.",
        "NORMAL",
    )

    store_memory(
        "Production stopped for 20 minutes because of high temperature.",
        "HIGH_PRIORITY",
    )

    print("\n--- Semantic Search ---")

    query = "Have we seen a heating problem before?"

    print(f"\nQuery: {query}\n")

    results = search_memory(query)

    for result in results:
        print(
            f"Score: {result.score:.4f} | "
            f"{result.payload}"
        )

    shard.close()

    print("\n=== SEARCH COMPLETE ===")