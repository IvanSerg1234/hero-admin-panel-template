import { configureStore} from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/heroesFiltersSlice';

const stringMiddleware = () => (next) => (action) => { // Сразу возвращаем новый dispatch с проверкой на строку
    if (typeof action === 'string') {
        return next({type: action});
    }
    return next(action);
};

// const store = createStore( 
//                     combineReducers({heroes, filters}), 
//                     compose(applyMiddleware(thunk, stringMiddleware),
//                             window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//                 );

const store = configureStore({
    reducer: {heroes, filters},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'

})

export default store;
