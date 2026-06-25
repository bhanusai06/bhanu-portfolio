# Full-Stack Deployment Guide: GitHub, MongoDB Atlas, and Railway

This guide walks you through the steps to push your newly updated full-stack portfolio to GitHub, set up a free MongoDB cloud database, deploy your Express backend to Railway, and connect them.

---

## Step 1: Push Your Code to GitHub

Since we have already initialized your local Git repository and created the initial commit, you just need to connect it to your GitHub account.

1. Go to [GitHub](https://github.com) and log in.
2. Click the **New** button to create a new repository.
   * **Repository Name:** `bhanu-portfolio`
   * **Description:** *Bhanu Sai's Full-Stack Engineering Portfolio*
   * **Visibility:** Public (recommended for portfolios)
   * **Do NOT** check "Add a README", "Add .gitignore", or "Choose a license" (we have already created these locally).
3. Click **Create repository**.
4. Copy the commands under *"…or push an existing repository from the command line"* and run them in your terminal in the `c:\Users\BHANU SAI\Downloads\bhanu-portfolio` folder:
   ```bash
   git remote add origin https://github.com/bhanusai06/bhanu-portfolio.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Set Up a Free MongoDB Database (MongoDB Atlas)

To store contact form submissions, we will use MongoDB Atlas, which provides a free-tier database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
2. Click **Create** to deploy a new database.
   * Choose the **M0 Free** cluster.
   * Select your preferred cloud provider and region (e.g., AWS / N. Virginia).
   * Click **Create**.
3. Create your database credentials:
   * **Username:** Choose a username (e.g., `bhanu_admin`).
   * **Password:** Click **Autogenerate Secure Password** and copy it (you will need this in Step 3).
   * Click **Create User**.
4. Configure your network security:
   * Under **IP Access List**, add `0.0.0.0/0` (this allows Railway's dynamic servers to securely connect to your database).
   * Click **Add Entry**.
5. Click **Finish and Close** and go to your Database Dashboard.
6. Click the **Connect** button next to your cluster:
   * Select **Drivers** (Node.js).
   * Copy the connection string. It will look like this:
     `mongodb+srv://bhanu_admin:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`
   * Replace `<password>` with the secure password you generated and copied in step 3. Keep this string ready for Step 3.

---

## Step 3: Deploy the Express Backend to Railway

We will deploy your `backend` folder to [Railway](https://railway.app), a developer-friendly cloud hosting platform.

1. Go to [Railway](https://railway.app) and sign up or log in using your GitHub account.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `bhanu-portfolio` repository.
4. Configure the service to deploy the backend subfolder:
   * Once the service is added, click on it to open its panel.
   * Go to the **Settings** tab.
   * Under **General**, look for **Root Directory** and set it to `/backend` (this tells Railway to only build and run the backend code in that folder).
5. Add your environment variables:
   * Go to the **Variables** tab in the service panel.
   * Click **Add Variable** and add:
     * `PORT` = `5000` (Railway will automatically map this to its public port)
     * `MONGO_URI` = `your_mongodb_connection_string_from_step_2`
6. Click **Save**. Railway will automatically trigger a new deployment.
7. Generate your public backend domain:
   * Go to the **Settings** tab of the service.
   * Under **Environment**, click **Generate Domain** or **Custom Domains**.
   * Copy the generated domain (e.g., `https://bhanu-portfolio-backend.up.railway.app`).

---

## Step 4: Update Your Frontend with the Production Backend URL

Now, we just need to make sure your front-end sends form submissions to your live Railway API instead of the default placeholder.

1. Open `index.html` in your editor.
2. Scroll to the `snd()` function (around line 2735) and locate this block:
   ```javascript
   const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
     ? "http://localhost:5000"
     : "https://bhanu-portfolio-backend.up.railway.app"; // Replace with your actual Railway URL once deployed
   ```
3. If your generated Railway domain is different from `https://bhanu-portfolio-backend.up.railway.app`, replace it with your actual domain.
4. Save the file.
5. Commit and push the final changes to GitHub:
   ```bash
   git add .
   git commit -m "chore: update production backend URL"
   git push
   ```

---

## Step 5: Test the Form!
1. Go to your live front-end (e.g., Vercel, Netlify, or GitHub Pages).
2. Scroll to the contact form, fill in your name, email, and a test message, and click **Send Message**.
3. The form will display *"Establishing secure connection and sending..."* followed by *"Thank you! Your message has been received and logged securely."*
4. Go to your MongoDB Atlas dashboard -> **Browse Collections** to see your test message stored securely in the `messages` collection!
