SHELL = /bin/bash

CWD := $(shell pwd)

WASM_MOD_NAME := deno-wasm
WASM_OUT_DIR := "$(CWD)/../build/$(WASM_MOD_NAME)"
WASM_OUT := $(WASM_OUT_DIR)/$(WASM_MOD_NAME).js
WASM_SRC_DIR := wasm/src
WASM_SRC := $(wildcard $(WASM_SRC_DIR)/*.rs)

CLI_SRC_DIR := cli-test/src
CLI_SRC := $(wildcard $(CLI_SRC_DIR)/*.rs)
CLI_OUT := cli-test/target/release/cli-test

.PHONY: all wasm cli
all: wasm

wasm: $(WASM_OUT)

cli: $(CLI_OUT)

$(WASM_OUT): $(WASM_SRC)
	cd $(WASM_SRC_DIR); \
	wasm-pack build --release --target web --out-dir "$(WASM_OUT_DIR)" --out-name "$(WASM_MOD_NAME)"; \
	read -r -d "" ENTRY_SRC_FIXED < <(sed -Ee $$'/typeof input === .string./{N;N;i'$$'input = Deno.readFileSync(input.slice(7));\n''d}' < "$(WASM_OUT)"); \
	echo -n "$$ENTRY_SRC_FIXED" > "$(WASM_OUT)";

$(CLI_OUT): $(CLI_SRC)
	cd $(CLI_SRC_DIR); \
	cargo build --release

