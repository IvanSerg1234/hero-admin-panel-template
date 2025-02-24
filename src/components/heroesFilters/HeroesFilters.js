import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { activeFilterChanged, fetchFilters } from './heroesFiltersSlice';
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters); // Получаем фильтры из store
    const dispatch = useDispatch(); // useDispatch для отправки нового персонажа в store
    const {request} = useHttp(); // Хук для отправки запросов на сервер

    // Запрос на сервер для получения фильтров и последовательной смены состояния
    useEffect(() => {
        dispatch(fetchFilters(request)); // Ставим статус загрузки
        
        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") { // Если статус загрузки, то выводим загрузку
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") { // Если ошибка, то выводим ошибку
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr) => { // Функция для рендера фильтров по элементам
        if (arr.length === 0) { // Если фильтры не найдены, то выводим сообщение
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>
        }

        // Данные в json-файле я расширил классами и текстом
        return arr.map(({name, className, label}) => { // Проходимся по фильтрам

            // Используем библиотеку classnames и формируем классы динамически
            const btnClass = classNames('btn', className, { // Формируем классы
                'active': name === activeFilter // Если имя фильтра равно активному фильтру, то добавляем класс active
            });
            
            return <button 
                        key={name} 
                        id={name} 
                        className={btnClass}
                        onClick={() => dispatch(activeFilterChanged(name))}
                        >{label}</button>
        })
    }

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;