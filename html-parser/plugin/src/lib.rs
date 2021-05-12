use deno_core::ZeroCopyBuf;
use deno_core::op_sync;
use deno_core::OpState;
use deno_core::Extension;
use deno_core::error::AnyError;
use futures::future::FutureExt;
use core::parse as parse_rs;
use core::parse_frag as parse_frag_rs;

#[no_mangle]
pub fn init() -> Extension {
  Extension::builder()
    .ops(vec![
      ("deno_dom_parse_sync", op_sync(deno_dom_parse_sync)),
      ("deno_dom_parse_frag_sync", op_sync(deno_dom_parse_frag_sync))
    ])
    .build()
}

fn deno_dom_parse_sync(
  _state: &mut OpState,
  data_str: String,
  _zero_copy: Option<ZeroCopyBuf>,
) -> Result<String, AnyError> {
  Ok(parse_rs(data_str))
}

fn deno_dom_parse_frag_sync(
  _state: &mut OpState,
  data_str: String,
  _zero_copy: Option<ZeroCopyBuf>,
) -> Result<String, AnyError> {
  Ok(parse_frag_rs(data_str))
}

