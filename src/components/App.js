import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { store } from '../index.js';
import { newArray, filteredArray, clearArray, getString } from '../actions/index';

const App = ({ updatedArray, unMatchedLetters, unMatchedLettersLength, guessWord }) => {
    const [ data, setData ] = useState([]);
    const [ count, setCount ] = useState(0);
    const [ arrayCount, setArrayCount ] = useState(0);

    console.log(guessWord);

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
            setArrayCount(0);
            shuffle(data);
            console.log('data ' + data);
        }

        replaceLetter(data[arrayCount].word);
        clearWord();
        console.log('random Function');
    }

    const shuffle = (a) => {
        // create copy or new array
        
        let newArr = [...a];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            return;
        }
        setData(newArr);
    }

    const replaceLetter = (string) => {
        let currentString = string;
        store.dispatch(getString(currentString));
    }

    useEffect(() => {
        const checkLetter = (event) => {
            let letter = String.fromCharCode(event.keyCode).toLowerCase();
        
            if(event.keyCode >= 65 && event.keyCode <= 90) {
                store.dispatch(newArray(letter));
                store.dispatch(filteredArray(guessWord));
            }
    
            if(event.keyCode === 13) {
                // clearWord();
                // checkScore();
            }
        }
    
        document.addEventListener('keydown', checkLetter);

        return () => {
            document.removeEventListener('keydown', checkLetter);
        }
    }, []); 

    // store oldValueArray compare to newValueArray
    const usePrevious = (value) => {
        const ref = useRef();

        useEffect(() => {
            ref.current = value;
        }, [value]);

        return ref.current;
    }

    const prevArray = usePrevious(filteredArray);

    // check if array has been updated
    const arrayChanged = filteredArray!== prevArray;

    const revealMatchedWord = (string, guessed) => {
        if(string.length > 0) {
            const regExpr = new RegExp(`[^${guessed.join("")}\\s]`, 'ig');
            return string.replace(regExpr, '_');    
        }
    }

    const curr = revealMatchedWord(guessWord, updatedArray);
    const isGuessed = curr === guessWord; // check if word is guessed 
    
    // check if word is guessed
    // wrong attempt counter
                             
    const clearWord = () => {
        store.dispatch(clearArray());
    }

    const checkScore = () => {
        // let newScore = Math.round(((1000 / (count / curr.length)) * 20) / 100);
        setCount(0);
    }

    const checkResult = () => {
        if(unMatchedLettersLength > 4 || isGuessed) {
            delay();
        } 
    }

    const delay = () => {
        setTimeout(() => {
            console.log('This will run when player guessed the word');
            randomWord();
        }, 2000);
    };
    clearInterval(delay);

    useMemo(checkResult, [unMatchedLettersLength, isGuessed])
  
    return (
        <div>
            <p>{guessWord}</p>
            <p>{revealMatchedWord(guessWord, updatedArray)}</p>
            <button onClick={randomWord}></button>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    newArray: (currentArray) => dispatch(newArray(currentArray)),
    filteredArray: (getWord) => dispatch(filteredArray(getWord)),
    getString: (word) => dispatch(getString(word)), 
    cleanArray: () => dispatch(cleanArray())
});

const mapStateToProps = state => {
    console.log('state.game.currentWord ' + state.game.currentWord);
    return {
        updatedArray: state.game.currentArray || [],
        unMatchedLetters: state.game.filteredArray || [],
        unMatchedLettersLength: state.game.filteredArrayLength || 0,
        guessWord: state.game.currentWord || []
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);