#!/bin/bash

echo
echo "==================================================="
echo "      Deploying Payroll Management System Schema   "
echo "               to Neon PostgreSQL                  "
echo "==================================================="
echo

echo "[1/3] Checking for NEON_DB_URL environment variable..."
if [ -z "$NEON_DB_URL" ]; then
    echo "ERROR: NEON_DB_URL environment variable not set!"
    echo "Please set your Neon PostgreSQL connection string as an environment variable."
    echo "Example: export NEON_DB_URL=postgres://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname"
    exit 1
fi
echo "Found NEON_DB_URL environment variable."

echo
echo "[2/3] Executing schema deployment script..."
echo "This may take a moment..."
psql "$NEON_DB_URL" -f db-schema.sql

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Schema deployment failed with error code $?"
    echo "Please check the error messages above."
    exit $?
fi

echo
echo "[3/3] Schema deployment completed successfully!"
echo
echo "==================================================="
echo "      Database schema has been deployed to Neon    "
echo "==================================================="

exit 0