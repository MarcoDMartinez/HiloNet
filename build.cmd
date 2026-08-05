@echo off
REM Script para compilar el proyecto HiloNet
REM Requiere: Java 11+ y Maven

setlocal enabledelayedexpansion

REM Buscar Java automáticamente
echo Buscando instalación de Java...
for /d %%D in ("C:\Program Files\Java\jdk-*") do (
    set "JAVA_HOME=%%D"
    echo JAVA_HOME encontrado: !JAVA_HOME!
    goto :found
)

echo Error: No se encontró Java instalado en C:\Program Files\Java
exit /b 1

:found
echo.
echo ============================================
echo Compilando HiloNet...
echo ============================================
echo.

call mvnw.cmd clean package -DskipTests %*

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo [OK] Compilación exitosa!
    echo ============================================
    dir target\*.war
) else (
    echo.
    echo ============================================
    echo [ERROR] La compilación falló
    echo ============================================
    exit /b %ERRORLEVEL%
)

endlocal
