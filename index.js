/**
 * nucleus-fetch-middleware: impurity blender to allow asynchronous Redux actions and reducers to stay pure
 * accept non-FSA action, but
 * @dispatch FSA compliant action for downstream processing:
 * {
 *   type: string,
 *   payload: fetch request params,
 * }
 * @param {object} action - non-FAD compliant action of format:
 * {
 *   type: string with format `FETCH-${clientName}-${actionName}-START`,
 *   payload: array - arguments to apply to clientName[actionName],
 *   success: (optional) success response mapper function,
 *   error: (optional) error response mapper function
 * }
 * @return {Promise} which resolves to success/error function return, also
 * @dispatch an FSD compliant action with resolved value as payload.
 * NOTE: The returned promise is only there as a mechanism for promise coordination.
 */

let middleware;

function createFetchMiddleware(fetchClients) {
  const clients = fetchClients;

  return ({ dispatch, getState }) => next => action => {
    if (typeof action.type !== 'string' || !action.type.startsWith('FETCH-') ||
      action.type.endsWith('-START') || action.type.endsWith('-SUCCESS') || action.type.endsWith('-ERROR')) {
      return next(action);
    }

    let [, clientName, actionName] = action.type.split('-');
    if (!clients[clientName]) {
      throw new Error(`Unknown client: ${clientName}, available clients are: [${Object.keys(clients)}]`);
    }
    const clientAction = clients[clientName][actionName] || clients[clientName];
    if (typeof clientAction !== 'function') {
      throw new Error(`Unsupported fetch action: ${clientAction}`);
    }

    const fetchParams = interpolateState(getState, action.payload);
    dispatch({
      type: `${action.type}-START`,
      payload: fetchParams // downstream middleware gets interpolated payload
    });

     // insert action thens before resolving promise to execute business logic. eg. data mapping
    return clientAction(...fetchParams)
      .then((res, err) => action.then ? action.then(res, err) : res)
      .catch((err) => action.catch ? action.catch(err) : Promise.reject(err))
      .then(handledResponse => {
        dispatch({
          type: `${action.type}-SUCCESS`,
          payload: handledResponse
        });
        return handledResponse;
      })
      .catch(thrownError => {
        dispatch({
          type: `${action.type}-ERROR`,
          payload: thrownError,
          error: true
        });
        return Promise.reject(thrownError);
      });
  };
}

// Provide a escape mechanism for action creater to request extra information (as selector) from redux state
// NOTE: this is considered anti-pattern by a few redux maintainers, use with caution.
// Usage also cause upstream middlewares gets different downstream
function interpolateState(getState, fetchParams) {
  return fetchParams.map(arg => typeof arg === 'function' /* isSelector */ ? arg(getState()) : arg);
}


export default function fetchMiddleware(middlewareConfig) {
  middleware = createFetchMiddleware(middlewareConfig);
  return middleware;
}
