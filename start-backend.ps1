# Script de démarrage du backend
Write-Host "Demarrage du backend Spring Boot..." -ForegroundColor Green

# Rafraichir le PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Aller dans le dossier backend
Set-Location backend

# Demarrer Spring Boot
mvn spring-boot:run
