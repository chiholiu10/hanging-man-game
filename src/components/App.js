import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'babel-polyfill';
import { connect } from 'react-redux';
import { store } from '../index.js';
import { newArray } from '../actions/index';
// import { isRegExp } from 'util';

const App = ({ currentArray }) => {
    const [ guessed, setGuessed ] = useState([]);
    const [ word, setWord ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ count, setCount ] = useState(0);
    const [ arrayCount, setArrayCount ] = useState(0);

    const [ wrongLetter, setWrongLetter ] = useState(0);
    const [ updateArray, setUpdateArray ] = useState(false);

    const array = useRef(null);

    useEffect(() => {
        const runEffect = async () => {
            const result = await axios('src/api/api.js');
            setData(result.data);
        }
        runEffect();
    }, []);

    const randomWord = () => {
        setArrayCount(arrayCount + 1);
        if((arrayCount >= data.length - 1)) {
            shuffle(data);
            setArrayCount(0);
            shuffle(data);
        } 
        replaceLetter(data[arrayCount].word);
        cleanWord();
    }

    const shuffle = (a) => {
        // create copy or new array
        
        let newArr = [...a];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        setData(newArr);
    }

    const replaceLetter = (string) => {
        let getString = string;
        setWord(getString);
    }

    useEffect(() => {
        const checkLetter = (event) => {
            let letter = String.fromCharCode(event.keyCode).toLowerCase();
            if(event.keyCode >= 65 && event.keyCode <= 90) {
                setCount(count + 1);
                setGuessed(prev => {
                    const next = [...prev, letter]
                    counter(next);
                    return next;
                });
            } 

            if(event.keyCode === 13) {
                checkScore();
            }
        }
    
        document.addEventListener('keydown', checkLetter);

        return () => {
            document.removeEventListener('keydown', checkLetter);
        }
    }, [guessed, count]);       

    const counter = (letterArray) => {
        let newUpdatedArray = letterArray.filter((v, i) => letterArray.indexOf(v) === i); 
        store.dispatch(newArray(newUpdatedArray));
        // checkMatchLetter();
    }   

    // store oldValueArray compare to newValueArray
    useEffect(() => {
        const storedArray = currentArray;
        array.current = storedArray;    

        return () => array.current; 
        
    }, [array.current, currentArray]);

    useEffect(() => {
        setUpdateArray(array.current !== currentArray);
    }, [array.current, currentArray]);

    // console.log('array.current' + array.current, 'currentArray ' + currentArray);

    // const checkMatchLetter = (letter) => {
    //     if(guessed.includes(letter)) {
    //         wrongLetter();
    //         return;
    //     }
        
    //     setGuessed(prev => [...prev, letter]);
    // }

    // const wrongLetter = () => {
    //     setCounterClicks(counterClicks + 1);
    //     if(counterClicks == 4) {
    //         console.log('game over');
    //     }
    // }

    const revealMatchedWord = (string, guessed = []) => {
        if(string.length > 0) {
            const regExpr = new RegExp(`[^${guessed.join("")}\\s]`, 'ig');
            return string.replace(regExpr, '_');
        }
    }

    const curr = revealMatchedWord(word, guessed);
    const isGuessed = curr === word; // check if word is guessed. 
                                               
    const cleanWord = () => {
        if(isGuessed) {
            setGuessed([]);
        }
        setWrongLetter(0)
    }

    const checkScore = () => {
        let newScore = Math.round(((1000 / (count / curr.length)) * 20) / 100);
        setCount(0);
    }

    return (
        <div>
            <p>{word}</p>
            <p>{revealMatchedWord(word, guessed)}</p>
            <button onClick={randomWord}></button>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    newArray: newUpdatedArray => dispatch(newArray(newUpdatedArray))
});

const mapStateToProps = state => {
    return {
        currentArray: state.game.emptyArray 
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);