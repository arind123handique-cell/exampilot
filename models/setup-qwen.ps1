# ==============================================================================
# ExamPilot AI — Setup & Verify Qwen2.5-Coder 7B (Q4_K_M)
# ==============================================================================

Write-Host "=== ExamPilot AI: Checking Ollama & Qwen2.5-Coder 7B ===" -ForegroundColor Cyan

# 1. Verify Ollama is installed
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Ollama is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Ollama from https://ollama.com" -ForegroundColor Yellow
    exit 1
}

# 2. Check if Ollama server is running
try {
    $res = Invoke-RestMethod -Uri "http://127.0.0.1:11434" -Method Get -TimeoutSec 3 -ErrorAction Stop
    Write-Host "Ollama server is active: $res" -ForegroundColor Green
} catch {
    Write-Host "Ollama server is not responding at http://127.0.0.1:11434." -ForegroundColor Yellow
    Write-Host "Starting Ollama in the background..." -ForegroundColor Cyan
    Start-Process ollama -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

# 3. Pull / verify Qwen2.5-Coder 7B (Q4_K_M)
Write-Host "Verifying qwen2.5-coder:7b (Q4_K_M)..." -ForegroundColor Cyan
ollama pull qwen2.5-coder:7b

# 4. Create custom ExamPilot calibrated model from Modelfile
$modelFilePath = Join-Path $PSScriptRoot "Modelfile"
if (Test-Path $modelFilePath) {
    Write-Host "Building custom 'exampilot-qwen' model from Modelfile..." -ForegroundColor Cyan
    ollama create exampilot-qwen -f $modelFilePath
}

# 5. Quick Test Prompt
Write-Host "`nTesting inference on qwen2.5-coder:7b..." -ForegroundColor Cyan
$testPayload = @{
    model = "qwen2.5-coder:7b"
    prompt = "State the Euler-Bernoulli beam formula and define each variable in 2 sentences."
    stream = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/generate" -Method Post -Body $testPayload -ContentType "application/json" -TimeoutSec 30
    Write-Host "`n--- Model Output ---" -ForegroundColor Green
    Write-Host $response.response -ForegroundColor White
    Write-Host "--------------------`n" -ForegroundColor Green
    Write-Host "Success: Qwen2.5-Coder 7B (Q4_K_M) is ready for ExamPilot!" -ForegroundColor Green
} catch {
    Write-Host "Warning: Inference test timed out or failed: $_" -ForegroundColor Yellow
}
