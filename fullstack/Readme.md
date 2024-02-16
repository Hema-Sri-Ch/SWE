used commands:

- npx create-react-app frontend
- cd frontend
- npm start

The above set of commands created and compiled frontend successfully


- cd backend
- npm init -y

The above command created some .json file in backend

in the backend, executed following commands to install some packages

- npm install bcryptjs
- npm install cookie-parse
- npm install cors dotenv express express-validator
- npm install pg
- npm install jsonwebtoken passport passport-jwt sequelize

In the package.json file, added the following line above the line `"main": "index.js"`
- "type": "module",

Finally added some code to index.js and config/database.js and executed following command
- nodemon index

This started server in port 5000

16-02-2024:
- Installed some packages in frontend via following commands
    npm install @mui/material @emotion/react @emotion/styled
    npm install @mui/icons-material
