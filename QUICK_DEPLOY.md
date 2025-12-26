# 🚀 Quick Deployment Reference

## Your Supabase Credentials (for Vercel)

When deploying to Vercel, add these environment variables:

```
VITE_SUPABASE_URL = https://idzmitumiclsnhoyieif.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkem1pdHVtaWNsc25ob3lpZWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTIyMzMsImV4cCI6MjA4MjA4ODIzM30.1jWvo0p5qJkervL42gh-GthHuPVOKX1xkRosmPdkYmw
```

## Quick Commands

### First Time Setup (Run Once)
```powershell
cd "C:\Users\Albin Antony\Downloads\tictactoeee-main\tictactoeee-main"
git init
git add .
git commit -m "Initial commit - Tic Tac Toe Arcade"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tictactoe-arcade.git
git push -u origin main
```

### Every Time You Make Changes
```powershell
cd "C:\Users\Albin Antony\Downloads\tictactoeee-main\tictactoeee-main"
git add .
git commit -m "Description of what you changed"
git push
```

## Next Steps

1. ✅ Git is installed (version 2.52.0)
2. ⏳ Create GitHub account (if needed): https://github.com/signup
3. ⏳ Create repository: https://github.com/new
4. ⏳ Run the "First Time Setup" commands above
5. ⏳ Deploy to Vercel: https://vercel.com/signup
6. ⏳ Add environment variables in Vercel
7. 🎉 Your site is live!

## Important Notes

- **Never commit the .env file** (it's already in .gitignore)
- **Always use environment variables in Vercel** for sensitive data
- **Wait 2-3 minutes** after pushing for Vercel to deploy
- **Check Vercel dashboard** for build logs if something goes wrong
