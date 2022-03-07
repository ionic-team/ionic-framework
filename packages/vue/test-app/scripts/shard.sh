CURRENT_SHARD=$1
TOTAL_SHARDS=$2

# Find all spec files and order alphabetically
paths=($(find ./tests/e2e/specs -name '*.js' | sort))
finalPaths=()

# Loop through each file
# and assign a shard for each test.
# If the shard number matches the current
# test runner's shard, add it to the final
# paths array
for index in "${!paths[@]}"; do
  chunk=$((index % TOTAL_SHARDS))
  if [ $chunk == $CURRENT_SHARD ]; then
    finalPaths+=(${paths[$index]})
  fi
done

# Echo the final paths.
# This will be passed to the
# test runner command to make
# sure specific tests run.
IFS=$','
echo "${finalPaths[*]}"
unset IFS
