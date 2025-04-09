@echo off
chcp 65001
echo Démarrage de l'application SuperNounou...

start "SuperNounou Backend" cmd /c "cd server && start_backend.bat"
timeout /t 2 /nobreak > nul
start "SuperNounou Frontend" cmd /c "start_frontend.bat"

echo Application démarrée !
echo Pour arrêter les serveurs, fermez les fenêtres correspondantes.
pause 