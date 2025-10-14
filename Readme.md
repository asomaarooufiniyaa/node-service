
# 🚀 Node Service – CI/CD Deployment to AWS EC2

A simple **Node.js API service** containerized with **Docker**, automatically built and deployed to an **AWS EC2 instance** using **GitHub Actions**.
This project demonstrates a full CI/CD pipeline from code push → Docker Hub → EC2 deployment.

---

## 🧱 Project Overview

The app exposes a small **Express.js** server with a protected `/secret` route that requires **Basic Authentication**.
It is built inside a Docker container and deployed to an AWS EC2 instance automatically via GitHub Actions.

---

## ⚙️ Technologies Used

* **Node.js / Express.js**
* **Docker**
* **GitHub Actions (CI/CD)**
* **AWS EC2 (Ubuntu 24.04)**
* **appleboy/ssh-action** (for remote deployment)

---

## 📁 Project Structure

```
.
├── Dockerfile
├── .github/
│   └── workflows/
│       └── main.yml
├── app.js
├── package.json
└── .env
```

---

## 🐳 Docker Setup

### Build and Run Locally

```bash
docker build -t node-service .
docker run -d -p 3000:3000 --name node-service --env-file .env node-service
```

Then visit:

```
http://localhost:3000/secret
```

and enter the username and password from your `.env` file.

---

## 🔑 Environment Variables (.env)

Create a file named `.env` in your project root:

```env
APP_USER=admin
PASSWORD=supersecret
```

---

## ⚡ GitHub Actions (CI/CD Pipeline)

The CI/CD pipeline is defined in `.github/workflows/main.yml`.

### Workflow Steps:

1. ✅ **Checkout Code**
2. 🐳 **Build and Push Docker Image** to Docker Hub
3. 🔐 **SSH into EC2**
4. 🚀 **Pull Latest Image & Run Container**

---

### Example Workflow File

```yaml
name: CI/CD

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Check out code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Docker login
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: asomaaroufiniyaa/node-service:latest

      - name: SSH to AWS and run container
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.AWS_HOST }}
          username: ubuntu
          key: ${{ secrets.AWS_KEY }}
          script: |
            docker pull asomaaroufiniyaa/node-service:latest
            docker stop node-service || true
            docker rm node-service || true
            docker run -d -p 3000:3000 --name node-service --env-file .env asomaaroufiniyaa/node-service:latest
```

---

## 🌍 Deployment

After each `git push` to the `main` branch:

1. GitHub builds and pushes your Docker image.
2. SSH connects to your EC2 instance.
3. The container is restarted with the latest code.

Access your app via:

```
http://<your-ec2-public-ip>:3000/secret
```

---

## 💡 Troubleshooting

* **"Cannot GET /secrets"** → The route is `/secret`, not `/secrets`.
* **Auth popup doesn’t appear** → Make sure `.env` file is mounted or `--env-file` flag is used.
* **Port not accessible** → Check EC2 security group allows inbound on port `3000`.

---

## 👤 Author

**Aso Maarooufiniyaa**
DevOps Engineer
