# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
You need to add a file named "data".
Inside this file, add your quiz like this
```js
{
  "quiz": {
    "title": "Test quiz",
    "description": "Ceci est un test",
    "count_number_questions": {
      "value": 2
    },
    "questions": [
      {
        "id": "_vzSeSoQWbjyf",
        "type": "SINGLE",
        "content": "Test question 1",
        "count_number_answers": {
          "value": 3
        },
        "answers": [
          {
            "id": "_M22UhmfrimhX",
            "content": "Choix 1",
            "isCorrect": false
          },
          {
            "id": "_ObEUMSAKDtlB",
            "content": "Choix 2",
            "isCorrect": true
          },
          {
            "id": "_75FrxzTKQK3N",
            "content": "Choix 3",
            "isCorrect": false
          }
        ]
      },
      {
        "id": "_be1NBxAApoi4",
        "type": "MULTIPLE",
        "content": "Question 2",
        "count_number_answers": {
          "value": 4
        },
        "answers": [
          {
            "id": "_qUwvOn9KmAFC",
            "content": "Choix 2",
            "isCorrect": false
          },
          {
            "id": "_TOoPHcMQgPxt",
            "content": "Choix 3",
            "isCorrect": true
          },
          {
            "id": "_9daobm8o7K1X",
            "content": "Choix 4",
            "isCorrect": false
          },
          {
            "id": "_jnNXnbaaLYMN",
            "content": "Choix 1",
            "isCorrect": true
          }
        ]
      }
    ]
  }
}
```