#!/bin/sh
set -e

# Max number of attempts
max_attempts=30
attempt_num=1

until nc -z mysql 3306
do
    echo "Waiting for MySQL to be available (attempt $attempt_num of $max_attempts)..."
    
    # Exit after max attempts
    if [ $attempt_num -eq $max_attempts ]
    then
        echo "Reached maximum number of attempts. MySQL is still not available. Exiting..."
        exit 1
    fi
    
    attempt_num=$(expr $attempt_num + 1)
    sleep 5
done

echo "MySQL is available! Starting application..."
exec java -jar app.jar