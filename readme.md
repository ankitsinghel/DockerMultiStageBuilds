# 📦 Docker Multi-Stage Builds — README

This project demonstrates a production-ready TypeScript Node.js server using Docker Multi-Stage Builds to create small, secure, and optimized images.

Docker multi-stage builds allow you to:

- **Compile/build your app in one container**
- **Run only the final optimized output in another**
- Keep the final image **small**, **secure**, and **fast to deploy**

This is especially useful for **TypeScript Node.js** apps where you compile TS → JS before running.

---

# 🚀 Why Multi-Stage Builds?

Normally, if you build a TypeScript project inside Docker, the image contains:

- TypeScript compiler
- Dev dependencies
- Source code
- Build tools

❌ This creates **large**, **slow**, and **insecure** images.

Multi-stage builds solve this by splitting the process into two stages:

1. **Builder stage** – installs all dependencies + compiles TypeScript
2. **Runner stage** – runs only the final JS output with only prod dependencies

Your production image becomes:

✔ Smaller
✔ Faster
✔ Cleaner (no TS, no dev tools)
✔ Secure (no source code inside)

---

# 🏗️ How Multi-Stage Works — Overview

```
FROM node:20-alpine AS builder     <-- Stage 1
   Install deps
   Compile TS → JS

FROM node:20-alpine AS runner      <-- Stage 2
   Copy compiled JS only
   Install only production deps
   Start server
```

Each `FROM` creates a **new clean layer**, but you can copy artifacts between them.

---

# 📁 Folder Structure Example

```
.
├── src/
│   └── index.ts
├── dist/               # Generated at build time
├── tsconfig.json
├── package.json
├── package-lock.json
└── Dockerfile

```

---

# 🐳 Example Multi-Stage Dockerfile (TypeScript + Node)

```dockerfile
# -----------------------
# STAGE 1: Build the app
# -----------------------
FROM node:20-alpine AS builder

WORKDIR /home/app

COPY package*.json .
COPY tsconfig.json .
RUN npm install

COPY src ./src

RUN npm run build


# -----------------------
# STAGE 2: Run the app
# -----------------------
FROM node:20-alpine AS runner

WORKDIR /home/app

# Copy only built JS files
COPY --from=builder /home/app/dist ./dist

# Copy only package.json to install production deps
COPY package*.json .

RUN npm install --omit=dev

CMD ["node", "dist/index.js"]
```

---

# 🧠 Why This is the Best Structure?

### **1️⃣ Builder stage -> Full power**

- Has TypeScript compiler
- Has devDependencies
- Has your entire source code
- Can run ESLint / tests / builds

### **2️⃣ Runner stage -> Minimal image**

- No TypeScript
- No dev tools
- Only final compiled JS
- Only production dependencies

A typical image shrinks from **600MB → 80MB**.

---

# ▶️ Running the Multi-Stage Build

Build the image:

```bash
docker build -t my-typescript-app .
```

Run the container:

```bash
docker run -p 3000:3000 my-typescript-app
```

---

# 🧪 Verify Your Image is Small

```bash
docker images my-typescript-app
```

---

# 🔥 Benefits for CI/CD

Multi-stage builds are perfect for pipelines:

- Stage 1: build & test
- Stage 2: run final optimized bundle

This keeps your deployments lightweight and secure.

---

# 🎯 Summary

| Feature          | Without Multi-Stage           | With Multi-Stage   |
| ---------------- | ----------------------------- | ------------------ |
| Image size       | ❌ Large                      | ✔ Small            |
| Security         | ❌ Source code & tools inside | ✔ Only compiled JS |
| Speed            | ❌ Slower                     | ✔ Faster           |
| Production ready | ❌ No                         | ✔ Yes              |
