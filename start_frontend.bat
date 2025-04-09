@echo off
chcp 65001
echo Démarrage du frontend...
cd %~dp0
npm run dev
pause 