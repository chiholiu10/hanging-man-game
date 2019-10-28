import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { store } from '../index.js';
import { newArray, filteredArray, clearArray, getString, scoreCounter } from '../actions/index';

const App = ({ updatedArray, unMatchedLettersLength, guessWord,  newCurrentScore }) => {
    const [ data, setData ] = useState([]);
    const [ arrayCount, setArrayCount ] = useState(0);

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
        }

        console.log(unMatchedLettersLength);
        replaceLetter(data[arrayCount].word);
        clearWord();
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
        console.log('unMatchedLettersLength ' + unMatchedLettersLength);
        const checkLetter = (event) => {
            let letter = String.fromCharCode(event.keyCode).toLowerCase();
    
            if(event.keyCode >= 65 && event.keyCode <= 90) {
            
                store.dispatch(newArray(letter));
                store.dispatch(filteredArray(guessWord));
            }
        }
    
        document.addEventListener('keydown', checkLetter);

        return () => {
            document.removeEventListener('keydown', checkLetter);
        }
    }, [unMatchedLettersLength]); 

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

    const checkScore = (count) => {
        let newScore = Math.round(((1000 / (count)) * 1.3) + 100);
       
        if(count == -10) {
            
        } else {
            store.dispatch(scoreCounter(newScore));
        }
    }

    const checkResult = () => {
        unMatchedLettersLength = unMatchedLettersLength < 1 ? 1 : unMatchedLettersLength;
        // console.log('unMatchedLettersLength ' + unMatchedLettersLength);
        
        if(unMatchedLettersLength > 4) {
            delay(-10);
        } else if (isGuessed) {
            delay(unMatchedLettersLength);
        }
    }

    // GET_WORD getString
    // CLEAR_ARRAY clearArray
    // SCORE_COUNTER scoreCounter

    const delay = (attempts) => {
        setTimeout(() => {
            randomWord();
            checkScore(attempts);
        }, 800);
    }

    clearInterval(delay);

    useMemo(checkResult, [unMatchedLettersLength, isGuessed]);
  
    return (
        <div>
            <p>Your Score: {newCurrentScore}</p>
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
    return {
        updatedArray: state.game.currentArray || [],
        unMatchedLettersLength: state.game.filteredArray.length,
        guessWord: state.game.currentWord || [],
        newCurrentScore: state.game.updatedCurrentScore || 0
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);