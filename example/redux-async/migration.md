### Prerequisite: make sure app actions are [FSA](https://github.com/acdlite/flux-standard-action/) compliant

## Step but step guide to migrate from redux-thunk: (one action at a time)

1. Import 'redux-pure-fetch' and add to applyMiddleware call.

2. Declare customized fetch clients. (Optional)

3. Replace thunk dispatched action types and corresponding reducer switches to follow `FETCH-${clientName}-${START/SUCCESS/ERROR}` pattern. Make sure app still working at this point

4. Convert ajax/fetch calls into pure action creators with fetch url/settings in the payload.

5. Extract actions in asynchronous callback/then handles into pure dataMapper functions, and call then in actions created in last step.

6. If thunk was reading other data from state, either connect the data from state and pass down in action creators (recommended), or user interpolating feature to retrieve data in the fetch client (likely to break abstraction)

7. Test. Then move on to the next action and repeat steps 3-5.

0. when all 'redux-thunk' actions are converted, removed it from applyMiddleware call. Note that thunk is not bad by itself to deserve an unconditional removal. It's just lack of restriction so developers can easily introduce procedural code or impure functions inadvertently, hence breaking functional reactive programming paradigm.
