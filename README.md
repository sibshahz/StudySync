# 🧠 StudySync — Academic SaaS Platform for Universities

**StudySync** is a full-stack SaaS platform purpose-built to simplify and streamline academic operations in universities and colleges across Pakistan.

Built on a modern monorepo architecture with **Turborepo**, it combines an intuitive frontend in **Next.js**, a powerful **Express.js** backend, and robust data modeling using **PostgreSQL** and **Prisma ORM**.

---

## ✨ Features

- 🔐 Role-based access: `Admin`, `Teacher`, `Student`, `Staff`
- 🏛️ Multi-organization support: users can create or join multiple universities
- 🔑 Secure join codes for onboarding teachers and students
- 🎓 Manage batches, departments, semesters, and course enrollment
- 📝 Assignment and quiz creation with submissions and grading
- 🧪 Custom grading schemes per batch with default fallbacks
- 🎓 Final Year Project (FYP) group and project management
- ⚡ Fast, modular monorepo setup using **Turborepo**

---

## 📁 Project Structure

```
studysync/
├── apps/
│   ├── web/         → Next.js frontend (student/teacher portal)
│   └── server/      → Express.js backend (API layer)
├── packages/
│   ├── db/          → Prisma schema and client
│   ├── ui/          → Shared React UI components (shadcn/ui, Tailwind)
│   └── config/      → Shared configs (eslint, typescript)
├── prisma/          → Prisma schema & migrations
└── turbo.json       → Turborepo configuration
```

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/studysync.git
cd studysync
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://your_user:your_pass@localhost:5432/studysync
DIRECT_URL=postgresql://your_user:your_pass@localhost:5432/studysync
JWT_SECRET=your_super_secret_key
```

### 4. Initialize the Database

```bash
npx prisma migrate reset
npx prisma generate
```

### 5. Start Development

To start both frontend and backend together:

```bash
pnpm turbo dev
```

To start only a specific app:

```bash
pnpm turbo dev --filter=web
pnpm turbo dev --filter=server
```

---

## 🚀 Build for Production

```bash
pnpm turbo build
```

Or build a specific app:

```bash
pnpm turbo build --filter=web
pnpm turbo build --filter=server
```

---

## 🔗 Remote Caching (Optional)

Enable Vercel Remote Caching for faster CI:

```bash
pnpm turbo login
pnpm turbo link
```

Learn more: [https://turborepo.org/docs](https://turborepo.org/docs)

---

## 🧪 Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | Next.js, Tailwind CSS, TypeScript |
| Backend  | Express.js, Node.js               |
| Database | PostgreSQL                        |
| ORM      | Prisma ORM                        |
| Auth     | JWT, Role-based Access Control    |
| DevOps   | Turborepo, Docker (optional)      |
| UI/UX    | shadcn/ui, Lucide Icons           |

---

## 💡 Example Use Cases

- ✅ A university admin creates an organization and invites faculty via join code.
- ✅ Teachers create assignments and quizzes for enrolled students.
- ✅ Students submit assignments and attempt quizzes.
- ✅ Admin configures a grading scheme for each batch.
- ✅ Final Year Projects are managed in groups with project titles, supervisors, and submission tracking.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

- Open issues for bugs or suggestions
- Submit a pull request with enhancements or fixes

Make sure to follow the established coding conventions and linting rules.

---

## 📬 Contact

Built with ❤️ by [Syed Shahid Gillani](https://github.com/sibshahz)  
📧 Email: `shahid5ssg@gmail.com`

---

## 📜 License

This project is licensed under the [MIT License](./LICENSE).
