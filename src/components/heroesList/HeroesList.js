import {useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';

import {useGetHeroesQuery, useDeleteHeroMutation} from '../../api/apiSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const { // Обьект - формирующийся из хука useGetHeroesQuery
        data: heroes = [],
        isLoading,
        isError,
    } = useGetHeroesQuery();

    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter); // Получаем активный фильтр из store

    const filteredHeroes = useMemo(() => {
        const filteredHeroes = heroes.slice(); // Создаем копию массива героев
        
        if (activeFilter === 'all') {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter(item => item.element === activeFilter);
        }
        // eslint-disable-next-line
    }, [heroes, activeFilter])

    const onDelete = useCallback((id) => {
        deleteHero(id);
        // eslint-disable-next-line
    }, []);

    if (isLoading) { // Если статус загрузки, то выводим загрузку
        return <Spinner/>;
    } else if (isError) { // Если ошибка, то выводим ошибку
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

        return arr.map(({id, ...props}) => {
            return (
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