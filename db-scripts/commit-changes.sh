#!/bin/bash

echo
echo "==================================================="
echo "        Committing Changes to Git Repository       "
echo "==================================================="
echo

echo "[1/4] Checking for changes..."
git status

echo
echo "[2/4] Adding all changes..."
git add .

echo
echo "[3/4] Committing changes..."
git commit -m "Refactor database schema for PostgreSQL and Neon deployment"

echo
echo "[4/4] Pushing changes to remote repository..."
git push

echo
echo "==================================================="
echo "     Database schema changes committed to Git      "
echo "==================================================="