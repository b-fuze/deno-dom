use deno_core::plugin_api::Buf;
use deno_core::plugin_api::Interface;
use deno_core::plugin_api::Op;
use deno_core::plugin_api::ZeroCopyBuf;
use futures::future::FutureExt;
use core::parse as parse_rs;
use core::parse_frag as parse_frag_rs;

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
  interface.register_op("denoDomParseSync", op_parse_sync);
  interface.register_op("denoDomParseFragSync", op_parse_frag_sync);
  // TODO:
  // interface.register_op("denoDomParseAsync", op_parse_async);
}

fn op_parse_sync(
  _interface: &mut dyn Interface,
  data: &[u8],
  _zero_copy: &mut [ZeroCopyBuf],
) -> Op {
  let data_str = std::str::from_utf8(&data[..]).unwrap();
  let result = Vec::from(parse_rs(data_str.into())).into_boxed_slice();
  Op::Sync(result)
}

fn op_parse_frag_sync(
  _interface: &mut dyn Interface,
  data: &[u8],
  _zero_copy: &mut [ZeroCopyBuf],
) -> Op {
  let data_str = std::str::from_utf8(&data[..]).unwrap();
  let result = Vec::from(parse_frag_rs(data_str.into())).into_boxed_slice();
  Op::Sync(result)
}

// old for reference:
// fn op_parse_sync(
//   _interface: &mut dyn Interface,
//   data: &[u8],
//   zero_copy: &mut [ZeroCopyBuf],
// ) -> Op {
//   let data_str = std::str::from_utf8(&data[..]).unwrap();
//   let zero_copy = zero_copy.to_vec();
//   if !zero_copy.is_empty() {
//     println!("Hello from plugin. data: {}", data_str);
//   }
//   for (idx, buf) in zero_copy.iter().enumerate() {
//     let buf_str = std::str::from_utf8(&buf[..]).unwrap();
//     println!("zero_copy[{}]: {}", idx, buf_str);
//   }
//   let result = b"test";
//   let result_box: Buf = Box::new(*result);
//   Op::Sync(result_box)
// }

// TODO: Async parsing implementation
fn op_parse_async(
  _interface: &mut dyn Interface,
  data: &[u8],
  zero_copy: &mut [ZeroCopyBuf],
) -> Op {
  let zero_copy = zero_copy.to_vec();
  if !zero_copy.is_empty() {
    let data_str = std::str::from_utf8(&data[..]).unwrap().to_string();
    println!("Hello from plugin. data: {}", data_str);
  }
  let fut = async move {
    for (idx, buf) in zero_copy.iter().enumerate() {
      let buf_str = std::str::from_utf8(&buf[..]).unwrap();
      println!("zero_copy[{}]: {}", idx, buf_str);
    }
    let (tx, rx) = futures::channel::oneshot::channel::<Result<(), ()>>();
    std::thread::spawn(move || {
      std::thread::sleep(std::time::Duration::from_secs(1));
      tx.send(Ok(())).unwrap();
    });
    assert!(rx.await.is_ok());
    let result = b"test";
    let result_box: Buf = Box::new(*result);
    result_box
  };

  Op::Async(fut.boxed())
}

// #[cfg(test)]
// mod tests {
//     #[test]
//     fn it_works() {
//         assert_eq!(2 + 2, 4);
//     }
// }
