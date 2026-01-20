#!/bin/bash
set -e

# Check if stellar CLI is already installed
if command -v stellar >/dev/null 2>&1; then
  echo "Stellar CLI already installed: $(stellar --version)"
  exit 0
fi

# Fix HOME directory for Vercel environment
if [ -d "/root" ] && [ "$HOME" != "/root" ]; then
  export HOME="/root"
fi

echo "Installing Rust toolchain..."
# Use CARGO_HOME and RUSTUP_HOME to avoid HOME issues
export CARGO_HOME="${CARGO_HOME:-$HOME/.cargo}"
export RUSTUP_HOME="${RUSTUP_HOME:-$HOME/.rustup}"

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain stable -y --no-modify-path

# Add cargo to PATH
export PATH="$CARGO_HOME/bin:$PATH"

echo "Adding WASM target..."
rustup target add wasm32v1-none

echo "Installing Stellar CLI..."
cargo install --locked stellar-cli

echo "Verifying Stellar CLI installation..."
stellar --version

echo "Stellar CLI installed successfully!"
