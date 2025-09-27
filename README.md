<<<<<<< HEAD
EduJobs MERN

Monorepo with React + Tailwind client and Express + Mongoose server.

Setup

1) Create server env file:

```
cd server
copy .env.example .env
```

Edit `.env` if needed.

2) Install deps:

```
npm install
cd client && npm install
cd ../server && npm install
```

3) Run both:

```
cd ..
npm run dev
```

Client: http://localhost:5173 (proxy to /api -> 4000)

Scripts

- npm run dev: run server and client concurrently
- npm --prefix client run build: build client
- npm --prefix server run build: build server




=======
# edujobs-mern
>>>>>>> ed1234e6e4ffdec6e1de9fbe5a2727f4c4828227
