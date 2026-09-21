@echo off
setlocal
title ExamPilot PYQ Importer

rem Run from the repository root so relative paths in the exporter resolve.
cd /d "%~dp0.."

echo ============================================================
echo  ExamPilot PYQ Importer
echo ============================================================
echo  Inbox : %~dp0
echo  Repo  : %CD%
echo.
echo  Put question-paper PDFs in this folder, then run this file.
echo.
echo  Common flags:
echo      import-pyq.bat                  import everything in the inbox
echo      import-pyq.bat --math           math/formula-heavy paper (recommended
echo                                      for papers with equations, diagrams)
echo      import-pyq.bat --force-image    render all pages as images (safe default)
echo      import-pyq.bat --push           import and publish to GitHub
echo      import-pyq.bat --inspect        check text vs scanned (no API calls)
echo      import-pyq.bat --dry-run        parse and summarise, write nothing
echo      import-pyq.bat --rebuild        regenerate generated.ts from out\ only
echo      import-pyq.bat --group topic    finer sub-heads by topic
echo      import-pyq.bat --exam "APSC AE Civil" --year 2025
echo      import-pyq.bat --math --push    math paper + publish
echo ============================================================
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo ERROR: Python was not found on PATH.
  echo Install Python 3.9+ from https://www.python.org/downloads/
  echo and tick "Add python.exe to PATH" during setup.
  echo.
  pause
  exit /b 1
)

python "tools\pyq_exporter\extract_pyq.py" --inbox "pyq-inbox" %*
set "EXITCODE=%errorlevel%"

echo.
if not "%EXITCODE%"=="0" (
  echo ------------------------------------------------------------
  echo  Import FAILED ^(exit code %EXITCODE%^). Nothing was pushed.
  echo ------------------------------------------------------------
) else (
  echo ------------------------------------------------------------
  echo  Import finished.
  echo  A local commit was created. Publishing is opt-in:
  echo      import-pyq.bat --push
  echo ------------------------------------------------------------
)
echo.
pause
exit /b %EXITCODE%
