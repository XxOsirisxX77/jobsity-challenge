# Jobsity Challenge

## Tech Stack

### Server
- [Java](https://www.java.com/en/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [JPA](https://spring.io/projects/spring-data-jpa)
- [ModelMapper](https://modelmapper.org/)
- [Lombok](https://projectlombok.org/)
- [H2](https://h2database.com/html/main.html)

### Web Application
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
- [react-hook-form](https://www.react-hook-form.com/)
- [React-Toastify](https://github.com/fkhadra/react-toastify#readme)

## Project Description

This project is for non-profit Foundations, to ease the sending of bulks emails to their donors. 

## Installation

1. We need to start up the server. In a terminal, go to the `server` folder, and run the following command:

```
./gradle bootRun
```

2. Once the server is up and running, we need to run the web application, in order to do this, we need to navigate to the `app` folder first in a terminal.

3. We need to download the dependencies running the following command:

```
npm i
```

4. Once dependencies are downloaded. Run the application, run the following command.

```
npm run dev
```

5. Once running, open a browser and navigate to `http://localhost:5173/`. The app should be running by now.

## Usage

First, before we can send emails in bulks, we need to add organizations.

At the top right of the application, there is a green button called "Add Organization" which allow us to add a new organization.

We can add as many organizations as we need, and all of them are displayed on the left side of the application.

In order to send bulk emails to those organizations, we need to first have a template for the emails, which consist of a subject and a body. You can use the special character combination `{ name }` and `{ address }`, from which the template will replace to place the organization name and address respectively.