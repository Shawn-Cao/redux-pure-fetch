# redux-pure-fetch

A declarative Redux middleware to manage asynchronous service calls and side-effects. Using browser fetch API internally but dispatch [FSA](https://github.com/acdlite/flux-standard-action/) actions, returns promises for optional promise orchestration

## Design Goal

1. promise unaware
2. declarative side effect
3. stay within Redux action => reducer pattern
  1. manage side-effect as separate response handlers so client code stay functional
  2. service request and response fires 2 separate actions so redux ticks twice (vs. once in redux-thunk which makes replay harder?)
4. testing concerns are addressed through dependency management (aiming for simple middleware swap or declarative response mocking)

## Non-goal

1. Abstract AJAX as a type of datasource, like local cache is not in scope. Rather, the library aims to allow easily wrapping to achieve that.
2. Move application logic in middleware. Fetch clients's responsibility only extends to managing connections.
3. Callback hell. Use more powerful libraries like Redux-epic solves that. Though this library intended to limit it's power to be more focused on asynchronous calls, it still returns a promise so regular promise orchestration would work and is up to the user. (Plus, callback is supposed to be less of a problem in Redux anyway.)

### Design choices

1. Not forcing dispatch on response: reducer can omit the dispatched undefined action
2. Sequential AJAX calls are supported by dispatching new actions in success/error handler.
3. Advanced promise coordination is not supported due to the declarative API design, until declarative coordination standard become available.
4. Accept extended [FSA](https://github.com/acdlite/flux-standard-action/) actions (with all serializable information within standard fields), and dispatch FSA actions for upstream/downstream middleware processing).
5. TODO: should work with [FETCH API](https://fetch.spec.whatwg.org/) (or XHR libraries like jQuery) standard.


## Inspired by

1. Discussions with Luke
2. https://goshakkk.name/redux-side-effect-approaches/
3. https://medium.com/javascript-and-opinions/redux-side-effects-and-you-66f2e0842fc3
4. http://blog.isquaredsoftware.com/2017/01/idiomatic-redux-thoughts-on-thunks-sagas-abstraction-and-reusability/
5. Concluding thought, the best practise of using redux, is as if it doesn't exist... Redux is not to help app developing, it's more of an elegant log system.
