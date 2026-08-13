---

# React-Django-Boilerplate

A modular full‑stack boilerplate for building **React + Django** applications.

This repository supports **two development paths**:

* **`main` branch** → Full-featured, scalable apps for large projects.
* **`simple_apps` branch** → Lightweight version for smaller apps or prototypes.

---

## Branches

### 1. `main` branch

- Full architecture with **Redux, modular backend, and all features**.
- Suitable for **large-scale production apps**.
- Includes advanced **state management, authentication, and APIs**.

### 2. `simple_apps` branch

- Simplified version for **learning, prototypes, or small projects**.
- Minimal setup, fewer dependencies, smaller folder structure.
- Easier to understand and extend for beginners.

---

## Getting Started

### Clone a specific branch

**Main branch (large apps):**

```bash
git clone --branch main --single-branch https://github.com/7078-cj/React-Django-Boilerplate.git
```

**Simple apps branch (small apps):**

```bash
git clone --branch simple_apps --single-branch https://github.com/7078-cj/React-Django-Boilerplate.git
```

---

## Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

- React app runs on: `http://localhost:5173`

---

## Backend Setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

- Backend runs on: `http://127.0.0.1:8000`

---

## Usage

- Choose branch according to app size.
- Use `main` for large apps with Redux and full features.
- Use `simple_apps` for smaller apps or learning purposes.

---

## Contribution

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## License

MIT License

---
