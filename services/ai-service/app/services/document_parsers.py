from io import BytesIO
from pathlib import Path

from PIL import Image
from pypdf import PdfReader
import pytesseract


def detect_file_type(mime_type: str, storage_path: str) -> str:
    suffix = Path(storage_path).suffix.lower()

    if mime_type == "application/pdf" or suffix == ".pdf":
        return "pdf"
    if mime_type.startswith("text/") or suffix in {".txt", ".md"}:
        return "text"
    if mime_type in {"image/png", "image/jpeg"} or suffix in {".png", ".jpg", ".jpeg"}:
        return "image"

    return "unknown"


def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    texts: list[str] = []

    for page in reader.pages:
        texts.append(page.extract_text() or "")

    return "\n".join(texts).strip()


def extract_text_from_text_file(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore").strip()


def extract_text_from_image(file_bytes: bytes) -> str:
    image = Image.open(BytesIO(file_bytes))
    return pytesseract.image_to_string(image).strip()


def extract_text(file_type: str, file_bytes: bytes) -> tuple[str, str]:
    if file_type == "pdf":
        text = extract_text_from_pdf(file_bytes)
        if text.strip():
            return text, "pypdf"
        return "", "pypdf"

    if file_type == "text":
        return extract_text_from_text_file(file_bytes), "utf8"

    if file_type == "image":
        return extract_text_from_image(file_bytes), "ocr"

    raise ValueError(f"Unsupported file type: {file_type}")
