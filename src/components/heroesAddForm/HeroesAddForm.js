// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import {useHttp} from '../../hooks/http.hook';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';

import {selectAll} from '../heroesFilters/heroesFiltersSlice';
import {useCreateHeroMutation} from '../../api/apiSlice';

const HeroesAddForm = () => {
    
    const [heroName, setHeroName] = useState(''); // Состояние для имени
    const [heroDescr, setHeroDescr] = useState(''); // Состояние для описания
    const [heroElement, setHeroElement] = useState(''); // Состояние для элемента

    const [createHero, {isLoading}] = useCreateHeroMutation();

    const {filtersLoadingStatus} = useSelector(state => state.filters); // Получаем фильтры из store
    const filters = selectAll(store.getState()); // Получаем фильтры из store
    const dispatch = useDispatch(); // useDispatch для отправки нового персонажа в store
    const {request} = useHttp(); // Хук для отправки запросов на сервер

    const onSubmitHandler = (e) => { // Функция для отправки формы
        e.preventDefault(); // Отменяем стандартное поведение формы

        const newHero = { // Создаем нового персонажа
            id: uuidv4(), // Генерируем уникальный id
            name: heroName, // Имя персонажа
            description: heroDescr, // Описание персонажа
            element: heroElement // Элемент персонажа
        }

        createHero(newHero).unwrap(); // Отправляем нового персонажа на сервер

        setHeroName(''); // Очищаем состояние имени
        setHeroDescr(''); // Очищаем состояние описания
        setHeroElement(''); // Очищаем состояние элемента
    }

    const renderFilters = (filters, status) => { // Функция для рендера фильтров
        if (status === "loading") { // Если статус загрузки, то выводим загрузку
            return <option>Загрузка элементов</option>
        } else if (status === "error") { // Если ошибка, то выводим ошибку
            return <option>Ошибка загрузки</option>
        }
        
        
        if (filters && filters.length > 0 ) { // Если фильтры есть и их длина больше 0
            return filters.map(({name, label}) => { // Проходимся по фильтрам
                // Один из фильтров нам тут не нужен
                // eslint-disable-next-line
                if (name === 'all')  return; // Если имя фильтра all, то пропускаем его

                return <option key={name} value={name}>{label}</option> // Возвращаем элемент option
            })
        }
    }

    return ( // Возвращаем форму
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    value={heroName}
                    onChange={(e) => setHeroName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={heroDescr}
                    onChange={(e) => setHeroDescr(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e) => setHeroElement(e.target.value)}>
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;