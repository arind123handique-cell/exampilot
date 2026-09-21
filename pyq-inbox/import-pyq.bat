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
echo  Anything after the file name is passed through, e.g.
echo      import-pyq.bat --inspect      check text vs scanned
echo      import-pyq.bat --push         publish to GitHub
echo      import-pyq.bat --group topic  finer sub-heads
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
