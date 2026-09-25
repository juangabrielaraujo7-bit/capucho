@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Execute npm ci nesta pasta antes de abrir a previa.
  pause
  exit /b 1
)
echo Abra http://127.0.0.1:5173 no navegador.
echo Para encerrar, pressione Ctrl+C.
call npm run dev
pause
