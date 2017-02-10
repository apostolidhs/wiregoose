# express-architect-mongoose-api-template

A template file structure for creating an API using express.js, mongoose, architect.js

## Modules Architecture

We are using a custom version of architect in order to take advantage of the module system. Architect is an elegant module system tool but when we need to use it, it force us to create a lot of boilerplate. Our idea is to keep the basic logic of Architect and throw away the unnecessary code.

## How it is working

It is working quite similar to the dependency injection logic. The main idea is to use an `index.js` file for every individual component. We use a single global function to register the modules.

#### Module registration

The module registration is as minimal as possible, the following example depicts the registration process. `KlarkModule` is just an example (*acronym of Express Architect Mongoose*), you can use your own name.

```Javascript

// module-1/index.js
KlarkModule(module, 'module1', () => {
    return {
        hello: () => console.log('hello world')
    };
});

// module-2/index.js
KlarkModule(module, 'module2', (module1) => {
    module1.hello(); // prints 'hello world'
});

```

The signature of `KlarkModule` is the following:

`KlarkModule(module, 'moduleName', controller);`

* module (object), is the node.js global variable.
* moduleName (string), is the name of the module.
* controller (Function), is the controller of the module. The arguments of this function could be other modules. This is the magic, you just have to use the same name of the modules as argument names and the module will automatically matched and set as argument.
* return value (any), what does the module exports.

**controller**

If you want to use a module from the node_modules (external module) you can prefix the module
name with a `$` and write the name in `camel case`.
For instance, the following function requires the external module `body-parser`,
and the internal module `logger`.

**Alias**

If you have the need to use an alias name for argument, you can write it on `core/module-alias.js`.
For instace, we require the module `_` that resolves to `_`, in `core/module-alias.js` the is a mapping from `_` to `lodash`.
So, the argument `_` finally resolves to `lodash`.

```Javascript
KlarkModule(module, 'app', ($bodyParser, logger) => {

  app.use(bodyParser.json());
  ...

});
```

##### Under the Hood

During the initialization of the application, our extension over the architect will:

* find all the index.js files under the plugins folder and set them as architect plugins
* parse the `KlarkModule` functions
* extract the controller arguments and set them as module dependencies (`consumes`)
* use the controller's return value as exported value (`provides`)

## Project Structure

All the necessary code for parsing and registering the modules for the architect is under the `/core` folder.
All the other code located under the `/plugins` folder.

### Plugin Architecture

The main idea under this file structure is that everything are plugins. So, we support that if we have the basic logic that composes the plugins `/code`, all the other are plugin modules.
Hence, the express.js initialization is a plugin, see `plugins/app/index.js`.
Our custom logging method is a plugin, see `plugins/logger/index.js`.
Even, the server initialization is a plugin, see `server/app/index.js`

## Issues for Windows

Architect cannot resolve the paths on Windowns. I do a temporary hot-fix:

Go to `node_modules/architect/architect.js`
in function `resolvePackageSync`

```Javascript
var prevBase;
while (base && prevBase !== base) {
    newPath = resolve(base, "node_modules", packagePath);
    if (existsSync(newPath)) {
        newPath = realpathSync(newPath);
        cache[packagePath] = newPath;
        return newPath;
    }
    prevBase = base;
    base = resolve(base, '..');
}
```