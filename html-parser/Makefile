SHELL = /bin/bash

CWD := $(shell pwd)

CORE_SRC_DIR := core/src
CORE_SRC := $(wildcard $(CORE_SRC_DIR)/*.rs)

WASM_MOD_NAME := deno-wasm
WASM_OUT_DIR := $(CWD)/../build/$(WASM_MOD_NAME)
WASM_OUT := $(WASM_OUT_DIR)/$(WASM_MOD_NAME).js
WASM_SRC_DIR := wasm/src
WASM_SRC := $(wildcard $(WASM_SRC_DIR)/*.rs)

CLI_SRC_DIR := cli-test/src
CLI_SRC := $(wildcard $(CLI_SRC_DIR)/*.rs)
CLI_OUT := cli-test/target/release/cli-test

PLUGIN_SRC_DIR := plugin/src
PLUGIN_SRC := $(wildcard $(PLUGIN_SRC_DIR)/*.rs)
PLUGIN_OUT := $(CWD)/plugin/target/release/libplugin.so
PLUGIN_OUT_FINAL := $(CWD)/../build/linux-x86_64/libplugin.so

.PHONY: all wasm plugin cli
all: wasm plugin cli

wasm: $(WASM_OUT)

plugin: $(PLUGIN_OUT_FINAL)

cli: $(CLI_OUT)

$(WASM_OUT): $(WASM_SRC) $(CORE_SRC)
	cd $(WASM_SRC_DIR); \
	wasm-pack build --release --target web --out-dir "$(WASM_OUT_DIR)" --out-name "$(WASM_MOD_NAME)"; \
	WASM_BASE64=$$( base64 -w 0 < "$(WASM_OUT_DIR)/$(WASM_MOD_NAME)_bg.wasm" ); \
	read -r -d "" ENTRY_SRC_FIXED < <( \
		sed -E < "$(WASM_OUT)" \
			-e $$'/typeof input === .string./{N;N;i'$$'input = Uint8Array.from(atob("WASM_BASE64"), c => c.charCodeAt(0));\n''d}' \
			-e "/imports\['env'\]/d" \
			-e '/imports = \{\};/a \    imports.env = { now() {} };' \
			-e "/^\s*import /d" \
			-e 's/load\(await input, imports\)/load(input, imports)/' \
	); \
	echo -n "$${ENTRY_SRC_FIXED/WASM_BASE64/$$WASM_BASE64}" > "$(WASM_OUT)";

$(PLUGIN_OUT_FINAL): $(PLUGIN_SRC) $(CORE_SRC)
	cd "$(PLUGIN_SRC_DIR)"; \
	cargo build --release; \
	mkdir -p "$$( dirname "$(PLUGIN_OUT_FINAL)" )"; \
	cp "$(PLUGIN_OUT)" "$(PLUGIN_OUT_FINAL)";

$(CLI_OUT): $(CLI_SRC) $(CORE_SRC)
	cd $(CLI_SRC_DIR); \
	cargo build --release; 

