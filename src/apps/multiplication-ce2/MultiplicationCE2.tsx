import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FinalMessage from '@/components/FinalMessage';
import ScoreDisplay from '@/components/ScoreDisplay';

const MultiplicationCE2 = () => {
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [numbers, setNumbers] = useState({ multiplicand: 0, multiplier: 0 });
  const [userAnswer, setUserAnswer] = useState(['', '', '', '', '', '', '', '']);
  const [carries, setCarries] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  const generateNumbers = () => {
    const multiplicand = Math.floor(Math.random() * 99999);
    const validDigits = [1, 2, 3, 4, 5];
    let multiplier = '';
    for (let i = 0; i < 3; i++) {
      multiplier += validDigits[Math.floor(Math.random() * validDigits.length)];
    }
    setNumbers({ 
      multiplicand, 
      multiplier: parseInt(multiplier)
    });
  };

  useEffect(() => {
    generateNumbers();
  }, [questionNumber]);

  const handleCarryInput = (index: number, value: string) => {
    const newCarries = [...carries];
    newCarries[index] = value;
    setCarries(newCarries);
  };

  const handleAnswerInput = (index: number, value: string) => {
    const newAnswer = [...userAnswer];
    newAnswer[index] = value;
    setUserAnswer(newAnswer);
  };

  const checkAnswer = () => {
    const correctAnswer = (numbers.multiplicand * numbers.multiplier).toString().padStart(8, '0');
    const userAnswerString = userAnswer.join('');
    
    if (userAnswerString === '') {
      setMessage("Effectue la multiplication !");
      return;
    }

    if (userAnswerString === correctAnswer) {
      setMessage('Bravo !');
      setScore(score + 1);
      if (questionNumber === 5) {
        setIsComplete(true);
      } else {
        setTimeout(() => {
          setQuestionNumber(questionNumber + 1);
          setUserAnswer(['', '', '', '', '', '', '', '']);
          setCarries(['', '', '', '', '', '']);
          setMessage('');
          setAttempts(0);
        }, 1500);
      }
    } else {
      if (attempts === 0) {
        setMessage('Une erreur ! Encore un essai !');
        setAttempts(1);
      } else {
        setMessage('Regarde bien la correction...');
        setShowContinue(true);
        setUserAnswer(correctAnswer.split(''));
      }
    }
  };

  const restart = () => {
    setScore(0);
    setQuestionNumber(1);
    setIsComplete(false);
    setUserAnswer(['', '', '', '', '', '', '', '']);
    setCarries(['', '', '', '', '', '']);
    setMessage('');
    setAttempts(0);
    setShowContinue(false);
    generateNumbers();
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="bg-gray-200 p-4 mb-6">
        <div className="flex items-center gap-12 max-w-2xl mx-auto">
          <img 
            src="/ceredis.png" 
            alt="Ceredis Logo" 
            className="h-12 w-auto"
          />
          <h1 className="text-xl font-semibold text-gray-700">
            Multiplication n°{questionNumber} : Effectue la multiplication ci-dessous.
          </h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto bg-[#DAE7ED]">
        <CardContent className="p-6">
          <div className="grid grid-cols-8 gap-1 text-center text-2xl mb-4">
            {/* Carries */}
            <div className="col-span-8 grid grid-cols-8 gap-1 mb-2">
              {carries.map((carry, index) => (
                <input
                  key={`carry-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-6 h-6 text-center border rounded text-sm ml-auto"
                  value={carry}
                  onChange={(e) => handleCarryInput(index, e.target.value)}
                />
              ))}
            </div>

            {/* Numbers display grid */}
            <div className="col-span-8 grid grid-cols-8 gap-1 mb-4 relative">
              <div className="col-span-8 grid grid-cols-8 gap-1">
                {numbers.multiplicand.toString().padStart(8, '0').split('').map((digit, index) => (
                  <div key={`multiplicand-${index}`} className="w-12 h-12 border rounded flex items-center justify-center bg-white">
                    {digit}
                  </div>
                ))}
              </div>
              <div className="absolute left-[-2rem] top-[3.7rem] text-2xl">×</div>
              <div className="col-span-8 grid grid-cols-8 gap-1">
                {numbers.multiplier.toString().padStart(8, '0').split('').map((digit, index) => (
                  <div key={`multiplier-${index}`} className="w-12 h-12 border rounded flex items-center justify-center bg-white">
                    {digit}
                  </div>
                ))}
              </div>
              <div className="col-span-8 border-b-2 border-black mt-2"></div>
            </div>

            {/* Answer inputs */}
            <div className="col-span-8 grid grid-cols-8 gap-1">
              {userAnswer.map((digit, index) => (
                <input
                  key={`answer-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center border rounded"
                  value={digit}
                  onChange={(e) => handleAnswerInput(index, e.target.value)}
                />
              ))}
            </div>
          </div>

          {message && (
            <Alert className="mt-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end mt-4">
            {!isComplete ? (
              !showContinue ? (
                <Button onClick={checkAnswer} className="bg-green-600 hover:bg-green-700">
                  Valider
                </Button>
              ) : (
                <Button onClick={() => {
                  setShowContinue(false);
                  setQuestionNumber(questionNumber + 1);
                  setUserAnswer(['', '', '', '', '', '', '', '']);
                  setCarries(['', '', '', '', '', '']);
                  setMessage('');
                  setAttempts(0);
                }} className="bg-blue-600 hover:bg-blue-700">
                  Continuer
                </Button>
              )
            ) : (
              <Button onClick={restart} className="bg-blue-600 hover:bg-blue-700">
                Recommencer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <ScoreDisplay score={score} questionNumber={questionNumber} />
        <FinalMessage score={score} isComplete={isComplete} />
      </div>
    </div>
  );
};

export default MultiplicationCE2;