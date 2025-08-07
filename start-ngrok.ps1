# Start ngrok tunnel for existing development server
# Make sure to run 'npm run dev:ngrok' first to start the server

Write-Host "Starting ngrok tunnel for existing development server..." -ForegroundColor Green
Write-Host "Make sure your dev server is running on port 5173" -ForegroundColor Yellow

# Check if port 5173 is in use
$port = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "Dev server detected on port 5173" -ForegroundColor Green
    # Start ngrok to expose the local server
    Write-Host "Starting ngrok tunnel..." -ForegroundColor Green
    ngrok http 5173
} else {
    Write-Host "No server found on port 5173. Please start the dev server first with 'npm run dev:ngrok'" -ForegroundColor Red
    Write-Host "Then run this script again." -ForegroundColor Red
}
