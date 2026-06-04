// Final Commit (Sprint 13)

# WTWR (What to Wear?): Back End

## Sprint 13 Project Submission

- Description:
  Setting up the authentication for the back-end of the WTWR project.

- Functionality:

  - Additional custom errors have been added for unathorized access, attempts to create new users with duplicate emails,
    and forbidden actions (i.e. deleting other user's cards.)
  - Authentication middleware has been added to prevent user's from accessing information they shouldn't have access to.

- Technology and Techniques:

  - MongoDB, Express.JS, Node.JS, ESLinter, Prettier
  - bcryptjs, jsonwebtoken (jwt), cors
  - NoSQL database storage

## Project Pitch Video

Check out [this video](https://drive.google.com/file/d/1-7P7Jn7JVHzWJ-HWnyEr6iHhybaRGNYn/view), where I describe my
project and some challenges I faced while building it.

---

```
// Final Commit (Sprint 12)

# WTWR (What to Wear?): Back End

## Sprint 12 Project Submission

- Description:
  The back-end part of the WTWR project.

- Functionality:

  - MongoDB integration for NoSQL database setup
  - Custom error handling for users, clothing items and the liking/unliking functionality of the clothing items
  - Usable Localhost based server setup

- Technology and Techniques:
  - MongoDB, Express.JS, Node.JS, ESLinter, Prettier
  - NoSQL database storage
```

---

```
// Initial Commit

# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12

```
