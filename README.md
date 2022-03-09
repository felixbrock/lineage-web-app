Setup
npx create-react-app my-app --template typescript

(https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md)
(https://eslint.org/blog/2019/01/future-typescript-eslint)
eslint: npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

(https://github.com/iamturns/eslint-config-airbnb-typescript)
eslint: npm i -D eslint-config-airbnb-typescript

(Check which versions are required. See output of previous command. Maybe installing without versions?)
eslint: npm i -D eslint-plugin-import
eslint: npm i -D eslint-plugin-jsx-a11y
eslint: npm i -D eslint-plugin-react
eslint: npm i -D eslint-plugin-react-hooks

<!-- npm i -D eslint-config-airbnb

INSTALL ALL: npm info "eslint-config-airbnb@latest" peerDependencies

CHECK FOR RIGHT VERSIONS AT: https://www.npmjs.com/package/eslint-config-airbnb-typescript
npm i -D eslint-config-airbnb-typescript
npm i -D @typescript-eslint/eslint-plugin@^???
npm i -D @typescript-eslint/parser@^??? -->

(https://prettier.io/docs/en/install.html)
prettier: npm i -D --save-exact prettier

(https://github.com/prettier/eslint-config-prettier#installation)
prettier: npm i -D --save-dev eslint-config-prettier

(https://thesoreon.com/blog/how-to-set-up-eslint-with-typescript-in-vs-code)
vs-code (Preferences: Open Settings (JSON)): "eslint.validate": ["typescript", "typescriptreact"] 

--------------------------------

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
