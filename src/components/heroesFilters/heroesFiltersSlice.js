import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import {useHttp} from '../../hooks/http.hook';

const filtersAdapter = createEntityAdapter();

// const initialState = { // Изначальное состояние без использования createEntityAdapter
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all'
// }

const initialState = filtersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all'
})

export const fetchFilters = createAsyncThunk(
    'filters/fetchHeroes',
    async () => {
        const {request} = useHttp();
        return await request("http://localhost:3001/filters");
    }
);

const heroesFiltersSlice = createSlice( {
    name: 'filters',
    initialState,
    reducers: {
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {
                state.filtersLoadingStatus = 'loading';
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle';
                filtersAdapter.setAll(state, action.payload);
            })
            .addCase(fetchFilters.rejected, state => {
                state.heroesLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesFiltersSlice;

export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);

export default reducer;
export const {
    filtersFetching,
    filtersFetched,
    filtersFetchingError,
    activeFilterChanged
} = actions;