# TypeLift

Javascript / Typescript type definitions by generic functions.

Most easy way how to create interfaces / enums / models for another purposes.

## Install

`yarn add typelift` or `npm i typelift`

## Import all library

es6:

```js
import {
  model,
  enums,
  required,
  modelInclude,
  modelExclude,
  isArray
} from "./typelift";
```

module:

```js
const {
  model,
  enums,
  required,
  modelInclude,
  modelExclude,
  isArray
} = require("typelift");
```

## Use

Creating of basic models

```js
import { model } from "typelift";

const userModel = model({
  user_id: { type: "uuid", required },
  comment_id: { type: "uuid", required },
  email: { type: "string", format: "email" }
});

const newUser = new userModel({ user_id: "" }); // Intellisense will help you with creating of new model. So each time you will know about types inside model. No matters if you are using js or ts.

console.log(newUser.scheme); // output JSONSCHEMA7 of model
```

Creating of nested models

```js
import { model, required } from "typelift";

const bookModel = model({ book_id: { type: "string" } });

const userModel = model({
  user_id: { type: "uuid", required },
  comment_id: { type: "uuid", required },
  email: { type: "string", format: "email" },
  book: { type: bookModel } //you can use nested models as well.
});

const newUser = new userModel({ book: { book_id: "" } });
```

Creating of enums

```js
import { model, enums } from "typelift";

const USER_TYPE = enums("ADMIN", "NORMAL");

const userModel = model({
  user_id: { type: "uuid" },
  comment_id: { type: "uuid" },
  email: { type: "string", format: "email" },
  user_type: { type: USER_TYPE }
});

const newUser = new userModel({ user_type: "ADMIN" });
```

## Available types

`Date boolean number string uuid timeUuid`

Each type can be as well undefined until you dont provide `required` prop into the model like this:

```js
import { model, required } from "typelift";

const userModel = model({
  user_id: { type: "uuid", required } // Required means that for creating new userModel instance the new value will be filled as well.
});

const newUser = new userModel(); // newUser will automatically generate new uuid for user_id prop becouse you provide required parameter = true
```

## Available Formats

`'date' | 'time' | 'date-time' | 'uri' | 'uri-reference' | 'uri-template' | 'email' | 'hostname' | 'ipv4' | 'uuid'`

for type string you can provide as well format property like this

```js
import { model } from "typelift";

const userModel = model({
  email: { type: "string", format: "email" } // email is type string with format of email
});
```

## Patterns

As well you can use custom regexes like this:

```js
import { model } from "typelift";

const userModel = model({
  email: { type: "string", pattern: "[abc]+" } // validation use new RegExp("[abc]+")
});
```

## External librabries

1.cassandra-driver // for creating of uuid types/

### Working nicely with javascript coded with love in typescript.
