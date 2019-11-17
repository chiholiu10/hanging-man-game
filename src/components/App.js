import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { 
    newArray, 
    filteredArray, 
    clearArray, 
    getString, 
    scoreCounter, 
    highScore, 
    resetCurrentScore, 
    wordCounter, 
    resetCounter
} from '../actions/index';
import '../App.css';

const App = ({ 
    newArray,
    filteredArray,
    getString,
    clearArray,
    allHighScores,
    wordCounter,
    scoreCounter,
    resetCounter,
    highScore,
    currentCounter,
    updatedArray, 
    unMatchedLettersLength, 
    guessWord,  
    newCurrentScore
}) => {
    const [ data, setData ] = useState([]);
    const [ highScores, setHighScores] = useState([]);
    const prevCount = usePrevious(currentCounter);
    const [ firstClick, setFirstClick ] = useState(false);
    const [ checkCounter, setCheckCounter ] = useState(false);
    const [ guessTheWord, setguessTheWord ] = useState(false);

    useEffect(() => {
        console.log('loading')
        const fetchApi = async () => {
            const result = await axios('src/api/api.js');
            setData(result.data);
        }
        fetchApi();
    }, []);

    const revealMatchedWord = (string, guessed) => {
        if(string.length > 0) {
            const regExpr = new RegExp(`[^${guessed.join("")}\\s]`, 'ig');
            return string.replace(regExpr, '_');
        } else {
            return;
        }
    }

    let curr = revealMatchedWord(guessWord, updatedArray);
    let isGuessed = curr === guessWord; // check if word is guessed

    useEffect(() => {
        setguessTheWord(isGuessed);
    }, [isGuessed]);

    function usePrevious(value) {
        const ref = useRef();

        useEffect(() => {
            ref.current = value;
        }, [value]);

        return ref.current;
    }

    useEffect(() => {
        if(prevCount == 5 && currentCounter == 0) {
            setCheckCounter(true);
        }
    }, [prevCount, currentCounter]);

    const shuffle = (a) => {
        // create copy or new array     
        
        let newArr = [...a];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }

        setData(newArr);
    }

    const handleKeyPress = useCallback(event => {
        let letter = String.fromCharCode(event.keyCode).toLowerCase();
        let alphabet = event.keyCode >= 65 && event.keyCode <= 90;	        
        let unMatchedLetterMax = unMatchedLettersLength < 5;	    


        if(alphabet && unMatchedLetterMax && !guessTheWord) {
            newArray(letter);	           
            filteredArray(guessWord);	    
        } else if(event.keyCode == 13) {	        
            event.preventDefault();	         
            return;	          
        } else {	                
            restartGame();	            
            checkLetters();
            return;	     
        }

    }, [guessTheWord, unMatchedLettersLength]);

    const checkFirstClick = () => {
        setFirstClick(true);
        if(firstClick) {
            checkLetters();
        } 
    }

    const counterIndex = () => {
        if(currentCounter > 4) {
            restartGame();
        } else {
            // else index 0 will be skipped
            wordCounter();
        }
        checkFirstClick();
        checkMatch();
    }

    const checkMatch = () => {
        // fallback to avoid console error
        if(data[currentCounter] == undefined) return;
        getString(data[currentCounter].word);

        clearArray();
    }

    const checkScore = (currentAttempts) => {
        scoreCounter(currentAttempts);
    }

    let timeOut;

    const delay = (attempts) => {
        timeOut = setTimeout(() => {
            checkScore(attempts);
        });
    }

    clearTimeout(timeOut);

    const storeScore = (unmatched) => {
        delay(unmatched);
        console.log('unmatched ' + unmatched);
    }

    const highScoreSave = (getCurrentScore) => {
        highScore(getCurrentScore);
        restartGame();
    }

    let checkLetters = () => {
        let maxLetterAttempt = unMatchedLettersLength < 4;
        console.log('unMatchedLettersLength ' + unMatchedLettersLength + 'inside isGuessed ' + guessTheWord + ' checkCounter ' + checkCounter);
        let currentScore;

        if(maxLetterAttempt && guessTheWord) {
            storeScore(300);

        } else if (maxLetterAttempt && !guessTheWord) {
            console.log('game over');
            highScoreSave();
        } else if (maxLetterAttempt && guessTheWord) {
            console.log('win next');
            if(checkCounter) {
                console.log('highscore stored');
                highScoreSave();

            }
        } else if (!maxLetterAttempt && !guessTheWord) {
            console.log('exceeded 5 letters');
            highScoreSave();
        } else {
            return
        }
    }

    const restartGame = () => {
        shuffle(data);
        resetCounter();
    }

    const highScoreList = allHighScores.map((allHighScores, key) => 
        <li key={key}>{allHighScores}</li>
    );

    return (
        <div>
            <p>{highScores}</p>
            <p>Your Score: {newCurrentScore}</p>
    
            <p>{guessWord}</p>
            <p>{revealMatchedWord(guessWord, updatedArray)}</p>

            <button id="button" onClick={counterIndex} onKeyDown={handleKeyPress}>Start</button>

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
    console.log(state.game.updatedCurrentScore, state.game.unsortedHighScores)
    return {
        updatedArray: state.game.currentArray || [],
        unMatchedLettersLength: state.game.filteredArray.length,
        guessWord: state.game.currentWord || [],
        newCurrentScore: state.game.updatedCurrentScore || 0,
        allHighScores: state.game.sortedAllHighScores || [],
        currentCounter: state.game.counter
    }
}

// stop game when letter has hit 5 times wrong! **
// dont push highscore after guessed word **
// exceeded 5 attemps of word guessing **
// restart when exceeded 5 attempts or when someone clicks even when there is nothing filled in
// restart game should start with index 0 **
// logic of highscore 
// logic of currentscore

// ux of start button...to force user to understand the software game.....

export default connect(mapStateToProps, mapDispatchToProps)(App);