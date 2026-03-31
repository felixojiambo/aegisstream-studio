import hashlib


class DeterministicEmbeddingClient:
    def __init__(self, dimensions: int = 1536) -> None:
        self.dimensions = dimensions

    def embed_text(self, text: str) -> list[float]:
        seed = hashlib.sha256(text.encode("utf-8")).digest()
        values: list[float] = []

        while len(values) < self.dimensions:
            seed = hashlib.sha256(seed).digest()
            for i in range(0, len(seed), 4):
                chunk = seed[i : i + 4]
                if len(chunk) < 4:
                    continue
                value = int.from_bytes(chunk, "big", signed=False)
                normalized = (value / 4294967295.0) * 2 - 1
                values.append(normalized)
                if len(values) >= self.dimensions:
                    break

        return values
