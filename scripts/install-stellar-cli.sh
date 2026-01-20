#!/bin/bash
set -e

# Check if stellar CLI is already installed
if command -v stellar >/dev/null 2>&1; then
  echo "Stellar CLI already installed: $(stellar --version)"
  exit 0
fi

echo "Installing Rust toolchain..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain stable -y

# Source cargo environment
export PATH="$HOME/.cargo/bin:$PATH"
source "$HOME/.cargo/env" 2>/dev/null || export PATH="$HOME/.cargo/bin:$PATH"

echo "Adding WASM target..."
rustup target add wasm32v1-none

echo "Installing Stellar CLI..."
cargo install --locked stellar-cli --features opt

echo "Verifying Stellar CLI installation..."
export PATH="$HOME/.cargo/bin:$PATH"
stellar --version

echo "Stellar CLI installed successfully!"
