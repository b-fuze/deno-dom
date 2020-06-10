SHELL = /bin/bash

MOD_NAME := deno-wasm
OUT_DIR := ../build/$(MOD_NAME)
OUT := $(OUT_DIR)/$(MOD_NAME).js
SRC := $(wildcard src/*.rs)

.PHONY: all dev
all: $(OUT)

$(OUT): $(SRC)
	wasm-pack build --release --target web --out-dir "$(OUT_DIR)" --out-name "$(MOD_NAME)"; \
	read -r -d "" ENTRY_SRC_FIXED < <(sed -Ee $$'/typeof input === .string./{N;N;i'$$'input = Deno.readFileSync(input.slice(7));\n''d}' < "$(OUT)"); \
	echo -n "$$ENTRY_SRC_FIXED" > "$(OUT)";

