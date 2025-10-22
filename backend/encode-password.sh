#!/bin/bash
# URL encode a password for use in DATABASE_URL
# Usage: ./encode-password.sh "YourPassword!@#"

if [ -z "$1" ]; then
    echo "Usage: ./encode-password.sh 'YourPassword'"
    exit 1
fi

PASSWORD="$1"
ENCODED=$(node -e "console.log(encodeURIComponent('$PASSWORD'))")

echo ""
echo "Original password: $PASSWORD"
echo "URL-encoded:       $ENCODED"
echo ""
echo "Use the encoded version in your DATABASE_URL like this:"
echo "postgresql://postgres.[ref]:${ENCODED}@aws-0-region.pooler.supabase.com:6543/postgres"
echo ""
