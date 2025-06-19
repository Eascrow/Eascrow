# Prettier & ESLint Setup

## Overview

This project has been configured with Prettier and ESLint to automatically format and lint code on save.

## Configuration Files

### Root Level

- `.prettierrc` - Prettier configuration with consistent formatting rules
- `.prettierignore` - Files and directories to exclude from formatting
- `.vscode/settings.json` - VSCode workspace settings for format on save
- `.vscode/extensions.json` - Recommended VSCode extensions

### Project Level

- `eascrow_dapp/.eslintrc.json` - ESLint configuration for dapp
- `eascrow_website/.eslintrc.json` - ESLint configuration for website

## Features

### Automatic Formatting

- **Format on Save**: Code is automatically formatted when you save files
- **ESLint Auto-fix**: ESLint issues are automatically fixed on save
- **Consistent Styling**: Single quotes, semicolons, proper indentation

### Available Scripts

Both projects now have these npm scripts:

- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Fix linting issues automatically
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are properly formatted

### VSCode Integration

The setup works automatically with VS Code when you have these extensions installed:

- Prettier - Code formatter (`esbenp.prettier-vscode`)
- ESLint (`dbaeumer.vscode-eslint`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

## Code Changes Made

### TableComponent.tsx

- Replaced hardcoded mock data with real transaction data
- Added proper data formatting and error handling
- Now displays actual Stellar blockchain transactions
- Added links to Stellar Expert for transaction details

### Data Flow

1. `useFreighterWallet` hook fetches real transactions from Horizon API
2. Components receive transaction data as props
3. TableComponent renders real data instead of mock data

## Usage

Files will be automatically formatted and linted when you save them in VS Code. You can also run the formatting/linting scripts manually from the terminal.
