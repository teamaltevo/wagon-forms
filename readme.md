<img src="https://assets.writools.ca/github/wagon-js.png" width="130"/>

## Wagon-forms v2

Wagon Forms is a ViewModel library and collection designed to speed up form building and simplify validation in reactive web applications. It is primarily designed to be used with Angular, but it can be used with any framework that supports RXJS.

### Demo 

The following repo provides an example of wagon-forms integration within an Angular Application

https://github.com/writools/wagon-forms-demo


### About the v2 :sparkles:

:warning: **v2 has major breaking changes from v1 beta releases.** :warning: 

However, the API is now stable and the library is ready for production use.

We've made a lot of improvements to the library, including:

- **Better TypeScript support** - The library is now more generic and can be binded to any data type.
    - E.g. FormViewModels can now be binded to a specific data type
- **Simpler validation framework** - The library now supports validation using Zod schemas.
- **Better use of RXJS** - Wagon-forms now uses RXJS more extensively and consistently.
- **API unification** - The API is now more consistent and easier to use.
- **Better documentation** - The documentation is now more complete and easier to understand. 
- **Better test coverage** - The library is now more thoroughly tested.

:book: Detailed documentation of the library is currently being written and will be available soon.

### Install
```sh
npm i @writools/wagon-forms
```

### Available tasks

- **npm run build** - Transpiles TS source files
- **npm run clean** - Removes the `./build` directory
- **npm run test** - Runs Jest test suites

