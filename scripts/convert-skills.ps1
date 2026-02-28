# Script to copy skills from .agent/skills/ to .blackbox/skills/

# Step 1: Clean up old .blackbox/skills/ directory (remove all contents but keep the directory)
Write-Host "=== Step 1: Cleaning up old .blackbox/skills/ ==="
if (Test-Path '.blackbox/skills') {
    Remove-Item -Path '.blackbox/skills\*' -Recurse -Force
    Write-Host "Cleaned .blackbox/skills/"
}

# Step 2: Create frontend directory for LapLap custom skill
Write-Host "=== Step 2: Creating frontend skill directory ==="
New-Item -ItemType Directory -Path '.blackbox/skills/frontend' -Force | Out-Null

# Step 3: Copy all skill directories from .agent/skills/ to .blackbox/skills/
Write-Host "=== Step 3: Copying skills ==="
$dirs = Get-ChildItem -Path '.agent/skills' -Directory
foreach ($dir in $dirs) {
    $dest = Join-Path '.blackbox/skills' $dir.Name
    Copy-Item -Path $dir.FullName -Destination $dest -Recurse -Force
    Write-Host "Copied: $($dir.Name)"
}

# Step 4: Remove 'allowed-tools' line from all SKILL.md files in .blackbox/skills/
Write-Host "=== Step 4: Removing allowed-tools from SKILL.md files ==="
$skillFiles = Get-ChildItem -Path '.blackbox/skills' -Recurse -Filter 'SKILL.md'
foreach ($file in $skillFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'allowed-tools:') {
        $newContent = $content -replace '(?m)^allowed-tools:.*\r?\n', ''
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Cleaned allowed-tools from: $($file.FullName)"
    }
}

Write-Host ""
Write-Host "=== Done! ==="
Write-Host "Total skill directories copied: $($dirs.Count)"

# List all skills now in .blackbox/skills/
Write-Host ""
Write-Host "Skills in .blackbox/skills/:"
Get-ChildItem -Path '.blackbox/skills' -Directory | ForEach-Object { Write-Host "  - $($_.Name)" }
