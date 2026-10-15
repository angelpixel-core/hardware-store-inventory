use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProductLocation {
    pub store: String,
    pub aisle: String,
    pub rack: String,
    pub shelf: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    pub id: String,
    pub name: String,
    pub brand: String,
    pub category: String,
    pub sku: String,
    pub barcode: String,
    pub unit: String,
    pub stock: i64,
    pub minimum_stock: i64,
    pub price: f64,
    pub cost: f64,
    pub location: ProductLocation,
    pub description: String,
    pub image: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum StockMovementType {
    Purchase,
    Sale,
    Return,
    Adjustment,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StockMovement {
    pub id: String,
    pub product_id: String,
    #[serde(rename = "type")]
    pub movement_type: StockMovementType,
    pub quantity: i64,
    pub unit_cost: Option<f64>,
    pub location: ProductLocation,
    pub note: Option<String>,
    pub created_at: String,
}
