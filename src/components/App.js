import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { newArray, filteredArray, clearArray, getString, scoreCounter, highScore, resetCurrentScore, wordCounter, resetCounter } from '../actions/index';
import '../App.css';

const App = ({ 
    newArray,
    filteredArray,
    getString,
    clearArray,
    highScore,
    allHighScores,
    wordCounter,
    scoreCounter,
    resetCounter,
    currentCounter,
    updatedArray, 
    unMatchedLettersLength, 
    guessWord,  
    newCurrentScore
}) => {

    const [ data, setData ] = useState([]);
    const [ highScores, setHighScores] = useState([]);

    useEffect(() => {
        const runEffect = async () => {
            const result = await axios('src/api/api.js');
            setData(result.data);
        }
        runEffect();
    }, []);

    const restartGame = () => {
        resetCounter();
        // getString(data[currentCounter].word);
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

    const handleKeyPress = useCallback(event => {
        let letter = String.fromCharCode(event.keyCode).toLowerCase();

        if(event.keyCode >= 65 && event.keyCode <= 90) {
            newArray(letter);
            filteredArray(guessWord);
        } else if(event.keyCode == 13) {
            event.preventDefault();
            return;
        } else {
            return;
        }
    });

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }
    }, [handleKeyPress]);

    const revealMatchedWord = (string, guessed) => {
        if(string.length > 0) {
            const regExpr = new RegExp(`[^${guessed.join("")}\\s]`, 'ig');
            return string.replace(regExpr, '_');    
        } else {
            return;
        }
    }
    
    let curr = revealMatchedWord(guessWord, updatedArray);
    const isGuessed = curr === guessWord; // check if word is guessed 

    const counterIndex = () => {
        if(currentCounter > 4) {
            shuffle(data);
            resetCounter();
        } 
        checkMatch();
    }


    const checkMatch = () => {
        wordCounter();

        // fallback to avoid console error
        if(data[currentCounter] == undefined) return;
        getString(data[currentCounter].word);
        clearArray();
    }

    let timeOut;

    const delay = (attempts) => {
       timeOut = setTimeout(() => {
            counterIndex();
            // checkScore(attempts);
        });
    }

    clearTimeout(timeOut);

    const checkWinner = (unmatched, guessed) => {
        if(guessed) {
            delay(unmatched);
        } else {
            delay(unmatched * -10); 
        }
    }
    let currentUnmatchedLetters;
    const checkLetters = () => {

        console.log(unMatchedLettersLength, isGuessed);
        if(unMatchedLettersLength > 4) {
            currentUnmatchedLetters = unMatchedLettersLength < 1 ? 1 : unMatchedLettersLength;
            checkWinner(currentUnmatchedLetters, isGuessed);
            highScore(newCurrentScore);
            restartGame();
        } else if (unMatchedLettersLength < 4 && isGuessed) {
            checkWinner(currentUnmatchedLetters, isGuessed);
            highScore(newCurrentScore);
        }
    }

    useMemo(checkLetters, [unMatchedLettersLength, isGuessed]);
   
    const highScoreList = allHighScores.map((allHighScores, key) => 
        <li key={key}>{allHighScores}</li>
    );

    return (
        <div>
            <p>{highScores}</p>
            <p>Your Score: {newCurrentScore}</p>
    
            <p>{guessWord}</p>
            <p>{revealMatchedWord(guessWord, updatedArray)}</p>

            <button onClick={counterIndex}>Start</button>

            <div>High Scores below: 
                <ol>{highScoreList}</ol>
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    newArray: (currentArray) => dispatch(newArray(currentArray)),
    filteredArray: (getWord) => dispatch(filteredArray(getWord)),
    getString: (word) => dispatch(getString(word)), 
    clearArray: () => dispatch(clearArray()),
    scoreCounter: (getScore) => dispatch(scoreCounter(getScore)),
    highScore: (getHighScore) => dispatch(highScore(getHighScore)),
    resetCurrentScore: () => dispatch(resetCurrentScore()),
    wordCounter: () => dispatch(wordCounter()),
    resetCounter: () => dispatch(resetCounter())
});

const mapStateToProps = state => {
    return {
        updatedArray: state.game.currentArray || [],
        unMatchedLettersLength: state.game.filteredArray.length,
        guessWord: state.game.currentWord || [],
        newCurrentScore: state.game.updatedCurrentScore || 0,
        allHighScores: state.game.sortedAllHighScores || [],
        currentCounter: state.game.counter 
    }
}

// stop game when letter has hit 5 times wrong!
// dont push highscore after guessed word
// logic of highscore
// logic of currentscore

// ux of start button...to force user to understand the software game.....

export default connect(mapStateToProps, mapDispatchToProps)(App);