const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
    filters: [],
    filtersLoadingStatus: 'idle',
    activeFilter: 'all',
    filteredHeroes: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                filteredHeroes: state.activeFilter === 'all' ? // Фильтруем героев по активному фильтру
                                action.payload : // Если активный фильтр all, то выводим всех героев
                                action.payload.filter(item => item.element === state.activeFilter), // Если нет, то фильтруем по элементу
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'FILTERS_FETCHING':
            return {
                ...state,
                filtersLoadingStatus: 'loading'
            }
        case 'FILTERS_FETCHED':
            return {
                ...state,
                filters: action.payload,
                filtersLoadingStatus: 'idle'
            }
        case 'FILTERS_FETCHING_ERROR':
            return {
                ...state,
                filtersLoadingStatus: 'error'
            }
        case 'ACTIVE_FILTER_CHANGED':
            return {
                ...state,
                activeFilter: action.payload,
                filteredHeroes: action.payload === 'all' ? // Фильтруем героев по активному фильтру
                                state.heroes : // Если активный фильтр all, то выводим всех героев
                                state.heroes.filter(item => item.element === action.payload) // Если нет, то фильтруем по элементу
            }
            
        case 'HERO_CREATED':
            // Формируем новый массив    
            let newCreatedHeroList = [...state.heroes, action.payload]; // Добавляем нового героя в массив
            return {
                ...state,
                heroes: newCreatedHeroList,
                filteredHeroes: state.activeFilter === 'all' ? // Фильтруем новые данные по фильтру, который сейчас применяется
                                newCreatedHeroList :  // Если активный фильтр all, то выводим всех героев
                                newCreatedHeroList.filter(item => item.element === state.activeFilter) // Если нет, то фильтруем по элементу
            }
        case 'HERO_DELETED': 
            // Формируем новый массив
            const newHeroList = state.heroes.filter(item => item.id !== action.payload);
            return {
                ...state,
                heroes: newHeroList,
                // Фильтруем новые данные по фильтру, который сейчас применяется
                filteredHeroes: state.activeFilter === 'all' ? 
                                newHeroList : 
                                newHeroList.filter(item => item.element === state.activeFilter)
            }
        default: return state
    }
}

export default reducer;