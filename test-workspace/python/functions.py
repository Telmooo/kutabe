# Python Functions - Kutabe Testing Workspace
#
# Usage:
#   - Place cursor inside any undocumented function
#   - Press Ctrl+Alt+D (Cmd+Alt+D on macOS)  OR
#   - Click "✎ Generate Docstring" in the CodeLens hint  OR
#   - Right-click → "Kutabe: Generate Docstring"
#
# To switch doc comment style, edit .vscode/settings.json:
#   "kutabe.python.style": "google"   (options: google | numpy | sphinx)


# ---------------------------------------------------------------------------
# 1. No parameters, no return type
# ---------------------------------------------------------------------------


def greet():
    print("Hello, world!")


# ---------------------------------------------------------------------------
# 2. Typed parameters + return type
# ---------------------------------------------------------------------------


def add(a: int, b: int) -> int:
    return a + b


def format_name(first: str, last: str, separator: str = " ") -> str:
    return f"{first}{separator}{last}"


# ---------------------------------------------------------------------------
# 3. Default parameter values
# ---------------------------------------------------------------------------


def repeat(text: str, times: int = 3, delimiter: str = ", ") -> str:
    return delimiter.join([text] * times)


# ---------------------------------------------------------------------------
# 4. *args and **kwargs
# ---------------------------------------------------------------------------


def log_event(event: str, *tags: str, **metadata) -> None:
    pass


def merge_dicts(*dicts: dict, overwrite: bool = True) -> dict:
    result = {}
    for d in dicts:
        if overwrite:
            result.update(d)
    return result


# ---------------------------------------------------------------------------
# 5. Nested functions (tests indentation preservation)
# ---------------------------------------------------------------------------


def outer(x: int, y: int) -> int:
    def inner(n: int) -> int:
        return n * 2

    return inner(x) + inner(y)


# ---------------------------------------------------------------------------
# 6. Async function
# ---------------------------------------------------------------------------


async def fetch_data(url: str, timeout: float = 30.0) -> bytes:
    pass


async def process_items(items: list[str], batch_size: int = 10) -> list[dict]:
    results = []
    return results


# ---------------------------------------------------------------------------
# 7. Already-documented function (extension should SKIP this one)
# ---------------------------------------------------------------------------


def divide(numerator: float, denominator: float) -> float:
    """Divide numerator by denominator.

    Args:
        numerator (float): The dividend.
        denominator (float): The divisor, must be non-zero.

    Returns:
        float: The result of the division.

    Raises:
        ZeroDivisionError: If denominator is zero.
    """
    if denominator == 0:
        raise ZeroDivisionError("denominator cannot be zero")
    return numerator / denominator


# ---------------------------------------------------------------------------
# 8. Complex type annotations
# ---------------------------------------------------------------------------


def transform(
    data: list[dict[str, int]],
    key: str,
    default: int = 0,
) -> list[int]:
    return [item.get(key, default) for item in data]


def zip_and_filter(
    keys: list[str],
    values: list[int | float],
    threshold: float = 0.0,
) -> dict[str, int | float]:
    return {k: v for k, v in zip(keys, values) if v > threshold}
