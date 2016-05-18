import _ from 'lodash';
import { createSelector } from 'reselect';
import { SIGN_OUT_SUCCESS } from '@ftbl/session-web';

export const LIMIT = 10;

export default function entities(state = {}, action) {
  if (action.type === SIGN_OUT_SUCCESS) return {};

  if (action && action.payload && action.payload.entities)
    return _.merge({}, state, action.payload.entities);
  return state;
};

export const entitiesSelector = (getState, key) => {
  return createSelector(getState, state => state.entities, (state, entities) => {
  
    const data = _.map(state.data, id => { return entities[key] && entities[key][id] });

    return _.assign({}, state, { data: _.compact(data) });
  });
};

export const entitiesReducer = ([ FETCH, SUCCESS, FAILED, CLEAR ]) => {
  const initialState = { fetching: false, fetched: false, data: [], meta: { query: { limit: LIMIT }}, error: null };
  
  return (state = initialState, action) => {
    switch (action.type) {
    case FETCH:
      return _.assign({}, state, { fetching: true, fetched: false, error: null });
    case SUCCESS:
      return _.assign({}, state, { fetching: false, fetched: true, data: action.payload.result, meta: action.meta });
    case FAILED:
      return _.assign({}, state, { fetching: false, error: action.payload.statusText });
    case CLEAR:
      return initialState;
    
    case SIGN_OUT_SUCCESS:
      return initialState;
    
    default:
      return state;
    }
  }
};