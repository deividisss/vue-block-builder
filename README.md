# BLockO

### 🌐 Project URL

- [AWS Amplify Deployment](https://aws-amplify.d2z61o2kyh820x.amplifyapp.com/)
- [Vercel Deployment](https://vue-block-builder.vercel.app/)

## 📸 BlockO in Action

![BlockO Logo](https://i.imgur.com/jz085ei.png)

## What is BlockO?

**BlockO** is a web-based block-building tool where you can **create, preview, and share your designs**. With an **interactive 3D viewer**, you can see your builds from every angle before sharing them with others. Browse community creations for inspiration or start from scratch to design something entirely your own.

---

## 🚀 Powered by Cutting-Edge Tech

BlockO runs on **Vue 3** and leverages the **Composition API** to create a flexible and maintainable user interface. **Tres.js** and **Three.js** bring your designs to life in stunning **3D**, while **TypeScript** ensures safe and scalable code.

On the backend, **AWS Lambda, Amazon API Gateway, and DynamoDB** work seamlessly to store and deliver your creations with speed and reliability—no matter where you are in the world.

---

## 🛠️ Tech Stack

### 🖥️ Frontend

- Vue 3 (Composition API)
- Tres.js, Three.js
- TypeScript
- ESLint & Prettier
- Vitest, Cypress
- BEM

### ☁️ Backend

- AWS Lambda
- Amazon API Gateway
- DynamoDB
- Amazon S3
- Amazon CloudFront
- Node.js

---

💡 _More updates and features coming soon!_ 🚀

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Commit Message Guidelines

For a clean and consistent Git commit history, it's a good practice to use **prefixes** for commit messages. These prefixes help quickly identify the nature of changes made in the commit.

### Common Prefixes

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation changes
- **style:** Formatting changes (spaces, semicolons, etc.)
- **refactor:** Code changes that neither fix a bug nor add a feature
- **test:** Adding or modifying tests
- **chore:** Maintenance tasks (build process, dependencies, non-code files)
- **perf:** Performance improvements
- **ci:** Continuous Integration-related changes (e.g., GitHub Actions, Travis CI)
- **build:** Changes to the build system or external dependencies
- **wip:** Work in progress _(optional, use for unfinished commits)_

### Example Commit Messages

#### 🚀 Features

✅ `feat: Implement user authentication flow`  
✅ `feat: Add login and registration endpoints`

#### 🐞 Bug Fixes

✅ `fix: Resolve issue with image upload URL generation`  
✅ `fix: Correct image URL generation in upload function`

#### 📖 Documentation

✅ `docs: Update README with image upload instructions`  
✅ `docs: Add example usage for image upload function`

#### 🎨 Styling

✅ `style: Fix indentation and formatting in useS3Upload.ts`  
✅ `style: Clean up extra spaces in upload function`

#### 🔄 Refactoring

✅ `refactor: Improve API call error handling in upload function`  
✅ `refactor: Simplify image resizing logic`

#### 🧪 Tests

✅ `test: Add unit test for image upload success scenario`  
✅ `test: Update tests to cover edge cases in image upload`

#### 🔧 Maintenance & Chores

✅ `chore: Update dependencies and remove unused imports`  
✅ `chore: Clean up old log statements in image service`

#### ⚡ Performance Improvements

✅ `perf: Optimize image processing logic`  
✅ `perf: Reduce memory usage in image upload function`

#### 🔄 Continuous Integration

✅ `ci: Add GitHub Actions workflow for automated deployment`  
✅ `ci: Update CI pipeline to run tests on push`

#### 🏗️ Build System

✅ `build: Configure Webpack for image asset handling`  
✅ `build: Update build process to optimize output size`

#### 🚧 Work in Progress

✅ `wip: Implement initial version of image upload composable`  
✅ `wip: Experiment with different upload strategies`
