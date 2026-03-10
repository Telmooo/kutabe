# Python Classes - Kutabe Testing Workspace
#
# Usage:
#   - Place cursor inside any undocumented function
#   - Press Ctrl+Alt+D (Cmd+Alt+D on macOS)  OR
#   - Click "✎ Generate Docstring" in the CodeLens hint  OR
#   - Right-click → "Kutabe: Generate Docstring"
#
# To switch doc comment style, edit .vscode/settings.json:
#   "kutabe.python.style": "google"   (options: google | numpy | sphinx)

from __future__ import annotations

from typing import Iterator


# ---------------------------------------------------------------------------
# 1. Simple class (no __init__)
# ---------------------------------------------------------------------------


class Counter:
    count: int = 0

    def increment(self) -> None:
        self.count += 1

    def reset(self) -> None:
        self.count = 0

    def value(self) -> int:
        return self.count


# ---------------------------------------------------------------------------
# 2. Class with typed __init__
# ---------------------------------------------------------------------------


class Point:
    def __init__(self, x: float, y: float, label: str = "") -> None:
        self.x = x
        self.y = y
        self.label = label

    def distance_to(self, other: Point) -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

    def translate(self, dx: float, dy: float) -> Point:
        return Point(self.x + dx, self.y + dy, self.label)

    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"


# ---------------------------------------------------------------------------
# 3. Class methods and static methods
# ---------------------------------------------------------------------------


class Temperature:
    def __init__(self, celsius: float) -> None:
        self._celsius = celsius

    @classmethod
    def from_fahrenheit(cls, fahrenheit: float) -> Temperature:
        return cls((fahrenheit - 32) * 5 / 9)

    @classmethod
    def from_kelvin(cls, kelvin: float) -> Temperature:
        return cls(kelvin - 273.15)

    @staticmethod
    def celsius_to_fahrenheit(celsius: float) -> float:
        return celsius * 9 / 5 + 32

    @staticmethod
    def is_valid_celsius(value: float) -> bool:
        return value >= -273.15

    def to_fahrenheit(self) -> float:
        return self._celsius * 9 / 5 + 32

    def to_kelvin(self) -> float:
        return self._celsius + 273.15


# ---------------------------------------------------------------------------
# 4. Properties (getter / setter)
# ---------------------------------------------------------------------------


class BoundedValue:
    def __init__(self, value: float, min_val: float, max_val: float) -> None:
        self._min = min_val
        self._max = max_val
        self._value = value

    @property
    def value(self) -> float:
        return self._value

    @value.setter
    def value(self, new_value: float) -> None:
        self._value = max(self._min, min(self._max, new_value))

    @property
    def is_at_min(self) -> bool:
        return self._value == self._min

    @property
    def is_at_max(self) -> bool:
        return self._value == self._max


# ---------------------------------------------------------------------------
# 5. Inherited class
# ---------------------------------------------------------------------------


class Shape:
    def __init__(self, color: str = "black") -> None:
        self.color = color

    def area(self) -> float:
        raise NotImplementedError

    def perimeter(self) -> float:
        raise NotImplementedError

    def describe(self) -> str:
        return f"{self.color} shape with area={self.area():.2f}"


class Circle(Shape):
    def __init__(self, radius: float, color: str = "black") -> None:
        super().__init__(color)
        self.radius = radius

    def area(self) -> float:
        import math

        return math.pi * self.radius**2

    def perimeter(self) -> float:
        import math

        return 2 * math.pi * self.radius


class Rectangle(Shape):
    def __init__(self, width: float, height: float, color: str = "black") -> None:
        super().__init__(color)
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)


# ---------------------------------------------------------------------------
# 6. Already-documented class (extension should SKIP this one)
# ---------------------------------------------------------------------------


class Stack:
    """A generic LIFO stack.

    Attributes:
        _items (list): Internal storage for stack items.
    """

    def __init__(self) -> None:
        """Initialize an empty stack."""
        self._items: list = []

    def push(self, item) -> None:
        """Push an item onto the stack.

        Args:
            item: The item to push.
        """
        self._items.append(item)

    def pop(self):
        """Pop and return the top item.

        Returns:
            The top item.

        Raises:
            IndexError: If the stack is empty.
        """
        return self._items.pop()

    def __iter__(self) -> Iterator:
        return reversed(self._items)
