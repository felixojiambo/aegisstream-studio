from dataclasses import dataclass


@dataclass
class TextChunk:
    index: int
    content: str
    token_count: int


def estimate_token_count(text: str) -> int:
    return max(1, len(text) // 4)


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[TextChunk]:
    if not text.strip():
        return []

    chunks: list[TextChunk] = []
    start = 0
    index = 0

    while start < len(text):
        end = min(len(text), start + chunk_size)
        content = text[start:end].strip()

        if content:
            chunks.append(
                TextChunk(
                    index=index,
                    content=content,
                    token_count=estimate_token_count(content),
                )
            )

        if end >= len(text):
            break

        start = max(0, end - overlap)
        index += 1

    return chunks
