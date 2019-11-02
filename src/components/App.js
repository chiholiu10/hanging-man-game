import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { newArray, filteredArray, clearArray, getString, scoreCounter, highScore } from '../actions/index';

const App = ({ 
    newArray,
    filteredArray,
    getString,
    clearArray,
    highScore,
    allHighScores,
    sortedHighScores,
    scoreCounter,
    updatedArray, 
    unMatchedLettersLength, 
    guessWord,  
    newCurrentScore 
}) => {

    const [ data, setData ] = useState([]);
    const [ arrayCount, setArrayCount ] = useState(0);
    const [ highScores, setHighScores] = useState([]);

    useEffect(() => {
        const runEffect = async () => {
            const result = await axios('src/api/api.js');
            setData(result.data);
        }
        runEffect();
    }, [setData]);
    
    const randomWord = () => {
        if(arrayCount >= 5) {
            setArrayCount(0); 
            restartGame();
            storeScore();
        } else {
            setArrayCount(arrayCount + 1);
            replaceLetter(data[arrayCount].word);
            clearArray();
            shuffle(data);
        }
    }

    const restartGame = () => {
        
    }

    const storeScore = () => {
        highScore(newCurrentScore);
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
        getString(currentString);
    }

    const handleKeyPress = useCallback(event => {
        let letter = String.fromCharCode(event.keyCode).toLowerCase();

        if(event.keyCode >= 65 && event.keyCode <= 90) {
            newArray(letter);
            filteredArray(guessWord);
        } else if(event.keyCode == 13) {
            randomWord();
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

    const curr = revealMatchedWord(guessWord, updatedArray);
    const isGuessed = curr === guessWord; // check if word is guessed 
    
    // check if word is guessed
    // wrong attempt counter

    const checkScore = (count) => {
        let newScore = Math.round(((1000 / (count)) * 1.3) + 100);
        if(count == -10) {
            restartGame();
        } else {
            scoreCounter(newScore);
        }
    }

    const checkResult = () => {
        unMatchedLettersLength = unMatchedLettersLength < 1 ? 1 : unMatchedLettersLength;
        
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
   
    const listItems = allHighScores.map((allHighScores, key) => 
        <li key={key}>{allHighScores}</li>
    );

    return (
        <div>
            <p>{highScores}</p>
            <p>Your Score: {newCurrentScore}</p>
    
            <p>{guessWord}</p>
            <p>{revealMatchedWord(guessWord, updatedArray)}</p>
            <button onClick={randomWord}></button>

            <div>High Scores below: 
                <ol>{listItems}</ol>
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
    highScore: (getHighScore) => dispatch(highScore(getHighScore))
});

const mapStateToProps = state => {
    return {
        updatedArray: state.game.currentArray || [],
        unMatchedLettersLength: state.game.filteredArray.length,
        guessWord: state.game.currentWord || [],
        newCurrentScore: state.game.updatedCurrentScore || 0,
        allHighScores: state.game.unsortedAllHighScores || []
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);