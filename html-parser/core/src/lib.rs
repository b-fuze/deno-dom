mod rcdom;

use std::rc::{Rc, Weak};
use std::cell::{Cell, RefCell};
use markup5ever::interface::tree_builder::TreeSink;
use markup5ever::Attribute;
use html5ever::tendril::stream::TendrilSink;
use html5ever::driver::parse_document;
use html5ever::driver::ParseOpts;
use crate::rcdom::RcDom;
use crate::rcdom::Node;
use crate::rcdom::NodeData;
use serde_json;

pub fn parse(html: String) -> String {
    let sink: RcDom = Default::default();
    let parser = parse_document(sink, Default::default());

    let dom = parser.one(html);
    dom_to_string(&dom)
}

pub fn dom_to_string(dom: &RcDom) -> String {
    node_to_string(&dom.document)
}

enum NodeType {
    Element,
    Text,
    Irrelevant,
}

fn node_to_string(dom: &Rc<Node>) -> String {
    let mut out = String::new();

    match dom.data {
        NodeData::Document => {
            let children = dom.children.borrow();
            if children.len() > 0 {
                for child in children.iter() {
                    out += &node_to_string(child);
                }
            }
        },

        NodeData::Element {
            ref name,
            ref attrs,
            ..
        } => {
            out = "[".to_owned() + &serde_json::to_string(&name.local).unwrap();
            out += ", ";
            out += &element_attributes(attrs);

            let children = dom.children.borrow();
            let children_count = children.len();
            if children_count > 0 {
                out += &", ".to_owned();

                let mut last_child_rendered = false;
                for (idx, child) in children.iter().enumerate() {
                    let child_string = node_to_string(child);
                    let child_string_len = child_string.len();

                    if last_child_rendered && child_string_len > 0 {
                        out += ", ";
                    }

                    out += &child_string;

                    if child_string_len > 0 {
                        last_child_rendered = true;
                    }
                }
            }

            out += "]";
        },

        NodeData::Text {
            ref contents,
        } => {
            out = serde_json::to_string(&contents.borrow().to_string()).unwrap();
        },

        _ => {},
    }

    out
}

fn element_attributes(data: &RefCell<Vec<Attribute>>) -> String {
    let mut out = "[".to_owned();
    let vec = data.borrow();
    let vec_count = vec.len();

    for (idx, attr) in vec.iter().enumerate() {
        out += &"[".to_owned();
        out += &serde_json::to_string(&String::from(attr.name.local.as_ref())).unwrap();
        out += &", ".to_owned();
        out += &serde_json::to_string(&String::from(attr.value.as_ref())).unwrap();

        if idx + 1 < vec_count {
            out += &"], ".to_owned();
        } else {
            out += &"]".to_owned();
        }
    }

    out += &"]".to_owned();
    out
}

// #[cfg(test)]
// mod tests {
//     #[test]
//     fn it_works() {
//         assert_eq!(2 + 2, 4);
//     }
// }

