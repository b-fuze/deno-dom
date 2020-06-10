use std::io::{self, Read};
use core::parse;

fn main() {
    let mut buf = String::new();
    io::stdin().read_to_string(&mut buf).unwrap();

    println!("{}", parse(buf));
}

