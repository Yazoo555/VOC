#!/bin/bash
# Search Unsplash and download eye care images (force overwrite)
set -e

mkdir -p images

# search_query|output_filename
SITES=(
  "optometrist-examining-patient|hero-exam"
  "eyeglasses-display-store|eyewear-display"
  "eyeglass-frames-collection|premium-frames"
  "designer-eyeglasses-collection|frame-collection"
  "contact-lens-case|contact-lenses"
  "optical-clinic-reception|clinic-reception"
  "eye-doctor-slit-lamp|diagnostic-room"
  "eye-chart-vision-testing|vision-testing"
  "person-reading-book-glasses|vision-assessment"
  "glasses-lens-optometry|lens-solutions"
  "person-trying-glasses|waiting-area"
  "smiling-woman-glasses|premium-eyewear"
)

for entry in "${SITES[@]}"; do
  query="${entry%%|*}"
  filename="${entry##*|}"
  
  echo "=== [$filename] Searching: $query ==="
  
  # Get search page HTML
  html=$(curl -sL --max-time 15 \
    -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    -H "Accept: text/html,application/xhtml+xml" \
    "https://unsplash.com/s/photos/${query}" 2>/dev/null)
  
  # Extract image URLs
  photo_urls=$(echo "$html" | grep -oP 'https://images\.unsplash\.com/photo-[a-zA-Z0-9_-]+' | sort -u | head -5)
  
  if [ -z "$photo_urls" ]; then
    echo "  No images found for '$query', trying alt terms..."
    # Try alternative search terms
    alt_query="eye-care-${query}"
    html2=$(curl -sL --max-time 15 \
      -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" \
      "https://unsplash.com/s/photos/${alt_query}" 2>/dev/null)
    photo_urls=$(echo "$html2" | grep -oP 'https://images\.unsplash\.com/photo-[a-zA-Z0-9_-]+' | sort -u | head -5)
  fi
  
  if [ -z "$photo_urls" ]; then
    echo "  FAILED: No images found for $filename"
    continue
  fi
  
  first_url=$(echo "$photo_urls" | head -1)
  echo "  URL: $first_url"
  
  # Download
  dl_url="${first_url}?q=85&w=1920&auto=format&fit=crop"
  http_code=$(curl -sL --max-time 30 -o "images/${filename}.jpg" -w '%{http_code}' "$dl_url" 2>/dev/null)
  
  if [ "$http_code" = "200" ] && [ -s "images/${filename}.jpg" ]; then
    img_type=$(file "images/${filename}.jpg" | grep -oP 'JPEG|PNG|WEBP' | head -1)
    size=$(stat -c%s "images/${filename}.jpg" 2>/dev/null || echo "?")
    echo "  OK: ${filename}.jpg ($size bytes, $img_type)"
  else
    echo "  FAILED (HTTP $http_code)"
    rm -f "images/${filename}.jpg"
  fi
  
  echo ""
done

echo "=== Final check ==="
ls -lh images/*.jpg 2>/dev/null || echo "No images downloaded"
