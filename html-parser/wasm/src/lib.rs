use wasm_bindgen::prelude::*;
use core::parse as parse_rs;

#[wasm_bindgen]
pub fn parse(html: &str) -> String {
    parse_rs(html.into())
}

