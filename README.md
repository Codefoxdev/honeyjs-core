# Honeyjs

Honey is a tool that helps to build (mobile) applications with vite and jsx.
It requires no (except for vite) external dependencies and is incredibly fast.

THIS TOOL IS IN VERY EARLY STAGES AND SHOUDN'T BE USED IN A PRODUCTION APP YET

### App

The entry point of your application is the `HoneyApp` function, here you can configure everything about it.
As of writing this, the only functional configuration is for the page transition.
You can create a new transitions with a preset, or make all the keyframes yourself, the syntax is the same as the native element.animate function.

```jsx
const App = HoneyApp({
  root: document.querySelector("#app"),
  config: {
    transition: new Transition("fade", {
      duration: 200,
      easing: "ease",
      fill: "forwards",
    }),
  },
});
```

Now that you have setup your app, you should render it

```jsx
App.render();
```

This will render the page provided at the current pathname, see [routing](#routing) for more info.
Some more properties on app include:

- `App.environment` wich will return `development` when using `vite` or `vite dev`, and production when your project has been builded.

### Events

```jsx
App.on("load", (e) => { ... });
```

Using the `App.on` function you can register an event listener on the app, the callback will then be fired when that event happens.
So for example when you register a navigate event listener, it will fire right before the navigation happens, and the event parameter keeps all the data about the event.
As well as a `event.preventDefault()` function, which will stop the event and its reponses when it is called,
the event also contains some other values like `event.defaultPrevented` and `event.cancelable`.

### Pages

This is what a sample page will look like:

```jsx
export default function () {
  return (
    <>
      <h1>Hello,</h1>
      <p>world</p>
    </>
  );
}
```

However components also have some special properties, like the `preserve` keyword.
When you switch between pages and you have the same element on both pages with a `preserve` keyword, that element will not transition, it will be left untouched.
This is helpfull when you transition between pages, but you want the navbar to stay the same.

### Routing

NOTE: Routing isn't finalized yet, so it will experience a lot of changes in the future
Routes are defined by calling the `defineRoutes` function, which looks something like this

```jsx
import { defineRoutes } from "@honeyjs/core";

import Home from "./pages/home";
import About from "./pages/about";

export default defineRoutes([
  {
    name: "home",
    route: "/",
    component: <Home />,
  },
  {
    name: "about",
    route: "/about",
    component: <About />,
  },
]);
```

### JSX

Honey uses vite's (or esbuild's) builtin jsx transformer alongside a custom jsx parser that transforms it into h functions,
which get parsed to native HTML elements by `@honeyjs/core/jsx-runtime`.
The vite config gets automatically updated once `@honeyjs/core/plugin` is used, however it isn't necessary.
The plugin just adds a Hot Module Replacement accept into the main file, wich can be toggled by changing the `addHMRAccept` property of the first parameter, which will look like this

```js
import { defineConfig } from "vite";
import honey from "@honeyjs/core/plugin";

export default defineConfig({
  plugins: [honey({ addHMRAccept: true })],
});
```

### Reactivity

Honey also exposes some methods for reactivity, which are heavily inspired by solid.js

```js
const [count, setCount] = createSignal(0);
```

A signal is a reactive variable, you can change it by calling `setCount(1)`, wich will change count to 1.

```js
createEffect(() => {
  console.log(`count was changed to: ${count()}`);
});
```

An effect is a function that gets called whenever a reactive value used in the effect changes, so when `setCount` is called and it isn't the same value, every effect that uses `count()` will be called.

```js
const getUsers = createMemo((id) => {
  users.find((e) => e.id == id);
});
```

The last method is a memoization function wich when called remembers wich output belongs to wich input.
A memoization function is basically a form of caching, wich will improve performance when calling lots of methods multiple times.

NOTE:
One drawback is that when using the reactive value in jsx, you have to pass it as a function

```jsx
<p>count: {count()}</p>         // Won't update the value
<p>count: {() => count()}</p>   // Will update
<p>count: {count}</p>           // This also works
```

### Page navigation

Create all of the pages and arrange them like this, it's the same as the router, but for mobile navigation

```jsx
export default function () {
  return (
    <Router swipe="horizontal">
      <Route path="/messages" component={Messages} />
      <Route path="/" component={Home} /> {/* This is the landing page; indicated by the path property; `/` is the starting route */}
      <Route path="/friends" component={Friends} />
      <Route path="/settings" component={Settings} >
        <Route path="/settings/profile" {/* or `path="profile"` results in the same */} component={profile} />
      </Route>
    </Router>
  );
}
```
