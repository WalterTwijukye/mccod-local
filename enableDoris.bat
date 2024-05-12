@echo off
set "jsonFile=C:\Program Files\ICD-API\appsettings.json"

:: Check if the file exists
if not exist "%jsonFile%" (
    echo Error: The specified file does not exist.
    exit /b 1
)

:: Use PowerShell to modify the JSON property
powershell -Command "Invoke-Expression -Command { (Get-Content '%jsonFile%' -Raw) -replace '\"enableDoris\":\s*false', '\"enableDoris\": true' | Set-Content '%jsonFile%' }"

:: Check if the modification was successful
if %errorlevel% equ 0 (
    echo Property 'enableDoris' set to 'true' successfully.
    exit /b 0
) else (
    echo Error: Failed to set property 'enableDoris' to 'true'.
    exit /b 1
)
