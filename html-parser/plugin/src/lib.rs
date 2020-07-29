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

// #[cfg(test)]
// mod tests {
//     #[test]
//     fn it_works() {
//         assert_eq!(2 + 2, 4);
//     }
// }
