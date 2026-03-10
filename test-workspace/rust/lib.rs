// Rust - Kutabe Testing Workspace
//
// Usage:
//   - Place cursor inside any undocumented function
//   - Press Ctrl+Alt+D (Cmd+Alt+D on macOS)  OR
//   - Click "✎ Generate Docstring" in the CodeLens hint  OR
//   - Right-click → "Kutabe: Generate Docstring"
//
// Rust uses Rustdoc style (the only supported style).
// Generated comments use `///` for items and `//!` for modules.

// ---------------------------------------------------------------------------
// 1. Simple public functions
// ---------------------------------------------------------------------------

pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn clamp(value: f64, min: f64, max: f64) -> f64 {
    if value < min {
        min
    } else if value > max {
        max
    } else {
        value
    }
}

pub fn repeat(text: &str, times: usize, separator: &str) -> String {
    (0..times).map(|_| text).collect::<Vec<_>>().join(separator)
}

// ---------------------------------------------------------------------------
// 2. Function with no parameters
// ---------------------------------------------------------------------------

pub fn version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

// ---------------------------------------------------------------------------
// 3. Private function
// ---------------------------------------------------------------------------

fn validate_range(value: f64, min: f64, max: f64) -> bool {
    value >= min && value <= max
}

// ---------------------------------------------------------------------------
// 4. Generic function
// ---------------------------------------------------------------------------

pub fn first<T>(items: &[T]) -> Option<&T> {
    items.first()
}

pub fn group_by<T, K, F>(items: Vec<T>, key_fn: F) -> std::collections::HashMap<K, Vec<T>>
where
    K: std::hash::Hash + Eq,
    F: Fn(&T) -> K,
{
    let mut map = std::collections::HashMap::new();
    for item in items {
        map.entry(key_fn(&item)).or_insert_with(Vec::new).push(item);
    }
    map
}

// ---------------------------------------------------------------------------
// 5. Struct definition
// ---------------------------------------------------------------------------

pub struct Point {
    pub x: f64,
    pub y: f64,
}

pub struct BoundingBox {
    pub min: Point,
    pub max: Point,
}

pub struct Config {
    pub host: String,
    pub port: u16,
    pub max_connections: usize,
    pub timeout_ms: u64,
}

// ---------------------------------------------------------------------------
// 6. impl block - methods
// ---------------------------------------------------------------------------

impl Point {
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    pub fn origin() -> Self {
        Self { x: 0.0, y: 0.0 }
    }

    pub fn distance_to(&self, other: &Point) -> f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }

    pub fn translate(&self, dx: f64, dy: f64) -> Point {
        Point {
            x: self.x + dx,
            y: self.y + dy,
        }
    }

    pub fn scale(&mut self, factor: f64) {
        self.x *= factor;
        self.y *= factor;
    }

    pub fn magnitude(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

impl BoundingBox {
    pub fn new(min: Point, max: Point) -> Self {
        Self { min, max }
    }

    pub fn contains(&self, point: &Point) -> bool {
        point.x >= self.min.x
            && point.x <= self.max.x
            && point.y >= self.min.y
            && point.y <= self.max.y
    }

    pub fn width(&self) -> f64 {
        self.max.x - self.min.x
    }

    pub fn height(&self) -> f64 {
        self.max.y - self.min.y
    }

    pub fn area(&self) -> f64 {
        self.width() * self.height()
    }
}

impl Config {
    pub fn new(host: impl Into<String>, port: u16) -> Self {
        Self {
            host: host.into(),
            port,
            max_connections: 100,
            timeout_ms: 5000,
        }
    }

    pub fn with_max_connections(mut self, max: usize) -> Self {
        self.max_connections = max;
        self
    }

    pub fn with_timeout(mut self, timeout_ms: u64) -> Self {
        self.timeout_ms = timeout_ms;
        self
    }
}

// ---------------------------------------------------------------------------
// 7. Already-documented function (extension should SKIP this one)
// ---------------------------------------------------------------------------

/// Divide two numbers.
///
/// # Arguments
///
/// * `numerator` - The dividend.
/// * `denominator` - The divisor.
///
/// # Returns
///
/// The quotient as `f64`.
///
/// # Panics
///
/// Panics if `denominator` is zero.
pub fn divide(numerator: f64, denominator: f64) -> f64 {
    if denominator == 0.0 {
        panic!("denominator cannot be zero");
    }
    numerator / denominator
}

// ---------------------------------------------------------------------------
// 8. Trait implementation (bonus)
// ---------------------------------------------------------------------------

pub trait Describable {
    fn describe(&self) -> String;
}

impl Describable for Point {
    fn describe(&self) -> String {
        format!("Point({}, {})", self.x, self.y)
    }
}

impl std::fmt::Display for Point {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}
