$ErrorActionPreference = 'Stop'
$files = Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\node_modules\\|\\.next\\|\\.git\\' }
$paths = $files | ForEach-Object { $_.FullName }
Compress-Archive -Path $paths -DestinationPath empowerher.zip -Force
Write-Host "Created empowerher.zip (excluding node_modules, .next, .git)"


