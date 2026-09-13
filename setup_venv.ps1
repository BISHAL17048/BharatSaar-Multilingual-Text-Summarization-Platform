# ============================================================
# setup_venv.ps1 - Sets up local Python venv for the project
# Run from project root: .\setup_venv.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$VenvPath = Join-Path $ProjectRoot ".venv"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  Multilingual Text Summarizer - Python VEnv Setup" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: Find Python 3.11 or 3.13 ---
Write-Host "[1/6] Looking for Python..." -ForegroundColor Yellow
$pythonCmd = $null

# Prefer py launcher for specific version
$candidates = @("py -3.11", "py -3.12", "py -3.13", "python3.11", "python3.12", "python3.13", "python")
foreach ($cmd in $candidates) {
    try {
        $ver = & ($cmd.Split()[0]) ($cmd.Split()[1..99]) "--version" 2>&1
        if ($ver -match "Python 3\.(1[1-9]|[2-9]\d)") {
            $pythonCmd = $cmd
            Write-Host "    Found: $ver ($cmd)" -ForegroundColor Green
            break
        }
    } catch {}
}

if (-not $pythonCmd) {
    # Fall back to default python
    $pythonCmd = "python"
    $ver = & python --version 2>&1
    Write-Host "    Using default: $ver" -ForegroundColor Yellow
}

# --- Step 2: Create venv ---
Write-Host ""
Write-Host "[2/6] Creating virtual environment at .venv ..." -ForegroundColor Yellow
if (Test-Path $VenvPath) {
    Write-Host "    .venv already exists, skipping creation." -ForegroundColor DarkGray
} else {
    & ($pythonCmd.Split()[0]) ($pythonCmd.Split()[1..99]) "-m" "venv" $VenvPath
    Write-Host "    Created .venv" -ForegroundColor Green
}

$pip = Join-Path $VenvPath "Scripts\pip.exe"
$python = Join-Path $VenvPath "Scripts\python.exe"

# --- Step 3: Upgrade pip ---
Write-Host ""
Write-Host "[3/6] Upgrading pip, setuptools, wheel..." -ForegroundColor Yellow
& $pip install --upgrade pip setuptools wheel

# --- Step 4: Install PyTorch with CUDA 12.8 ---
Write-Host ""
Write-Host "[4/6] Installing PyTorch CUDA 12.8 (for RTX 3050, driver 596/CUDA 13.2)..." -ForegroundColor Yellow
Write-Host "    This may take 5-10 minutes (downloading ~2.5GB)..." -ForegroundColor DarkGray
& $pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128

# --- Step 5: Install all other dependencies ---
Write-Host ""
Write-Host "[5/6] Installing project dependencies from requirements.txt..." -ForegroundColor Yellow
& $pip install -r (Join-Path $ProjectRoot "requirements.txt")

# --- Step 6: Install Playwright browsers ---
Write-Host ""
Write-Host "[6/6] Installing Playwright Chromium browser..." -ForegroundColor Yellow
& $python -m playwright install chromium

# --- Done ---
Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  VEnv location : $VenvPath" -ForegroundColor White
Write-Host "  Python binary  : $python" -ForegroundColor White
Write-Host ""

# Verify CUDA
Write-Host "Verifying CUDA..." -ForegroundColor Yellow
& $python -c "import torch; print(f'  PyTorch: {torch.__version__}'); print(f'  CUDA available: {torch.cuda.is_available()}'); print(f'  GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"N/A\"}')"

Write-Host ""
Write-Host "To activate the venv manually:" -ForegroundColor Cyan
Write-Host "  .\.venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host ""
Write-Host "To run the app with the venv, use:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "  (package.json will be updated to use .venv\Scripts\python)" -ForegroundColor DarkGray
Write-Host ""
