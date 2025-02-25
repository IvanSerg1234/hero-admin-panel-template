import { configureStore} from '@reduxjs/toolkit';
import filters from '../components/heroesFilters/heroesFiltersSlice';
import {apiSlice}  from '../api/apiSlice';

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
    reducer: {filters, 
                [apiSlice.reducerPath]: apiSlice.reducer}, // apiSlice.reducerPath - это ключ, apiSlice.reducer - это значение
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware()
            .concat(stringMiddleware, apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production'

})

export default store;
