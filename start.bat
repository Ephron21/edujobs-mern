@echo off
echo Starting EduJobs MERN Application...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting MongoDB (make sure MongoDB is installed and running)
echo.

echo Starting the application...
npm run dev

pause
