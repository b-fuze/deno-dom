mod rcdom;
mod common;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use wasm_bindgen::prelude::*;
use common::parse as parse_rs;

#[wasm_bindgen]
pub fn parse(html: &str) -> String {
    parse_rs(html.into())
    // let window = web_sys::window().expect("should have a window in this context");
    // let performance = window
    //     .performance()
    //     .expect("performance should be available");

    // let now = performance.now();
    // let count = parse_rs(html.into()).len();
    // format!("time:{}ms", (performance.now() - now))
}

