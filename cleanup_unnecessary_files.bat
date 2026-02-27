@echo off
echo ========================================
echo CAFE APP CLEANUP SCRIPT
echo ========================================
echo.
echo This script will delete unnecessary test and setup files
echo that are no longer needed for your cafe app.
echo.
echo Files to be deleted:
echo - 17 backend test/setup files
echo - 1 duplicate authMiddleware.js
echo - 1 SQL fix file
echo.
pause
echo.

cd /d "%~dp0"

echo Deleting backend test files...
del /F /Q "backend\test-api.js" 2>nul
del /F /Q "backend\test-api-otp.js" 2>nul
del /F /Q "backend\test-otp.js" 2>nul
del /F /Q "backend\test-phone-otp.js" 2>nul
del /F /Q "backend\test-twilio.js" 2>nul
echo ✓ Test files deleted

echo.
echo Deleting backend setup/fix files...
del /F /Q "backend\cleanup-otps.js" 2>nul
del /F /Q "backend\fix-users-table.js" 2>nul
del /F /Q "backend\init-database.js" 2>nul
del /F /Q "backend\insert-data.js" 2>nul
del /F /Q "backend\run-fix.js" 2>nul
del /F /Q "backend\run-schema.js" 2>nul
del /F /Q "backend\schema-update-guide.js" 2>nul
del /F /Q "backend\setup-database.js" 2>nul
del /F /Q "backend\simple-fix.js" 2>nul
del /F /Q "backend\update-schema.js" 2>nul
del /F /Q "backend\verify-setup.js" 2>nul
del /F /Q "backend\fix-missing-tables.sql" 2>nul
echo ✓ Setup/fix files deleted

echo.
echo Deleting duplicate files...
del /F /Q "authMiddleware.js" 2>nul
echo ✓ Duplicate files deleted

echo.
echo Deleting optional SQL files (already applied)...
del /F /Q "backend\complete-fix.sql" 2>nul
echo ✓ SQL fix files deleted

echo.
echo ========================================
echo CLEANUP COMPLETE!
echo ========================================
echo.
echo Your cafe app is now clean and optimized.
echo.
echo Next steps:
echo 1. Review COMPREHENSIVE_CODE_ANALYSIS.md for remaining fixes
echo 2. Fix the pause route paths (see analysis document)
echo 3. Remove unused dependencies from backend/package.json
echo 4. Test your app
echo.
pause
