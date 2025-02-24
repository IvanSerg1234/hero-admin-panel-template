import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import {createSelector} from '@reduxjs/toolkit';

import {heroDeleted, fetchHeroes} from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const filteredHeroesSelector = createSelector( // Создаем селектор для фильтрации героев)
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
            if (filter === 'all') {
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    );

    // const filteredHeroes = useSelector(state => { // используя useSelector формируем нужные данные на основании state
    //     if (state.filters.activeFilter === 'all') {
    //         console.log('render');
    //         return state.heroes.heroes;
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    //     }
    // })

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus); // Получаем фильтры из store
    const dispatch = useDispatch(); // useDispatch для отправки нового персонажа в store
    const {request} = useHttp(); // Хук для отправки запросов на сервер

    useEffect(() => { // Запрос на сервер для получения персонажей и последовательной смены состояния
        dispatch(fetchHeroes()) 

        // eslint-disable-next-line
    }, []);

    // Функция берет id и по нему удаляет ненужного персонажа из store
    // ТОЛЬКО если запрос на удаление прошел успешно
    // Отслеживайте цепочку действий actions => reducers
    const onDelete = useCallback((id) => { // Удаление персонажа по его id (ОБЯЗАТЕЛЬНО useCallback для корректной передачи дальше по иерархии)
        // Удаление персонажа по его id
        request(`http://localhost:3001/heroes/${id}`, "DELETE") // Запрос на сервер
            .then(data => console.log(data, 'Deleted')) // Если все ок, то выводим в консоль
            .then(dispatch(heroDeleted(id))) // Удаляем персонажа из store
            .catch(err => console.log(err)); // Если ошибка, то выводим в консоль
        // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") { // Если статус загрузки, то выводим загрузку
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") { // Если ошибка, то выводим ошибку
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => { // Функция для рендера списка героев
        if (arr.length === 0) {// Если героев нет, то выводим сообщение
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => { // Проходимся по героям
            return ( // Возвращаем элемент списка
                <CSSTransition 
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/> 
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes); // Получаем список героев
    return ( // Возвращаем список героев
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;