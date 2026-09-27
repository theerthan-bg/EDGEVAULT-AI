from pathlib import Path

from qdrant_edge import (
    Distance,
    EdgeConfig,
    EdgeShard,
    EdgeVectorParams,
    Point,
    UpdateOperation,
    Query,
    QueryRequest,
)

# Local Edge database location
SHARD_DIRECTORY = "./data/qdrant-edge"

VECTOR_NAME = "memory"
VECTOR_DIMENSION = 4

# Create storage directory
Path(SHARD_DIRECTORY).mkdir(parents=True, exist_ok=True)

# Configure Qdrant Edge
config = EdgeConfig(
    vectors={
        VECTOR_NAME: EdgeVectorParams(
            size=VECTOR_DIMENSION,
            distance=Distance.Cosine,
        )
    }
)

# Create local Edge shard
edge_shard = EdgeShard.create(SHARD_DIRECTORY, config)

# Add one test memory
point = Point(
    id=1,
    vector={
        VECTOR_NAME: [0.1, 0.2, 0.3, 0.4]
    },
    payload={
        "text": "Machine 07 experienced overheating.",
        "category": "NORMAL",
    },
)

edge_shard.update(
    UpdateOperation.upsert_points([point])
)

# Search the local memory
results = edge_shard.query(
    QueryRequest(
        query=Query.Nearest(
            [0.1, 0.2, 0.3, 0.4],
            using=VECTOR_NAME,
        ),
        limit=5,
        with_vector=False,
        with_payload=True,
    )
)

print("\n=== EDGEVAULT LOCAL MEMORY TEST ===")
print("Memory stored successfully!")
print("Search results:")
print(results)

# Close and save
edge_shard.close()

print("\nQdrant Edge local memory test completed!")