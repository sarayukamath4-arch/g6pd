"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowRight, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const quizModules = {
  "1": {
    title: "Understanding Hemolysis",
    description: "Learn what happens when red blood cells break down",
    questions: [
      {
        question: "What is hemolysis?",
        options: [
          "The process of red blood cell production",
          "The breakdown of red blood cells",
          "A type of white blood cell",
          "A genetic mutation"
        ],
        correct: 1,
        explanation: "Hemolysis is the breakdown of red blood cells, which can occur faster than they can be replaced in G6PD deficiency."
      },
      {
        question: "What enzyme is deficient in G6PD deficiency?",
        options: [
          "Glucose-6-phosphate dehydrogenase",
          "Hemoglobin",
          "Insulin",
          "Amylase"
        ],
        correct: 0,
        explanation: "G6PD (Glucose-6-phosphate dehydrogenase) is the enzyme that helps protect red blood cells from oxidative damage."
      },
      {
        question: "What protects red blood cells from oxidative stress?",
        options: [
          "G6PD enzyme",
          "Hemoglobin",
          "Platelets",
          "Plasma"
        ],
        correct: 0,
        explanation: "The G6PD enzyme helps produce molecules that protect red blood cells from oxidative damage."
      }
    ]
  },
  "2": {
    title: "Navigating Food Labels",
    description: "How to identify potential triggers in packaged foods",
    questions: [
      {
        question: "Which common food additive should G6PD-deficient individuals be cautious about?",
        options: [
          "Salt",
          "Sodium benzoate",
          "Sugar",
          "Vinegar"
        ],
        correct: 1,
        explanation: "Sodium benzoate is a preservative that some G6PD-deficient individuals may need to be cautious about, though evidence varies."
      },
      {
        question: "What should you look for on food labels?",
        options: [
          "Only calories",
          "Ingredient lists for known triggers",
          "Brand names only",
          "Package color"
        ],
        correct: 1,
        explanation: "Reading ingredient lists helps identify substances that may be problematic for your specific condition."
      },
      {
        question: "Are all foods with the same name equally risky?",
        options: [
          "Yes, always",
          "No, individual sensitivity varies",
          "Only processed foods are risky",
          "Only raw foods are risky"
        ],
        correct: 1,
        explanation: "Individual sensitivity varies greatly among people with G6PD deficiency. What affects one person may not affect another."
      }
    ]
  },
  "3": {
    title: "Medication Safety",
    description: "Working with healthcare providers on safe treatments",
    questions: [
      {
        question: "What should you do before starting a new medication?",
        options: [
          "Take it immediately",
          "Consult your healthcare provider about G6PD safety",
          "Ask a friend",
          "Search the internet only"
        ],
        correct: 1,
        explanation: "Always consult your healthcare provider about medication safety, especially regarding G6PD deficiency."
      },
      {
        question: "Which medication class is known to be high-risk for G6PD deficiency?",
        options: [
          "Antibiotics (specifically sulfonamides)",
          "Vitamins",
          "Minerals",
          "Probiotics"
        ],
        correct: 0,
        explanation: "Certain antibiotics like sulfonamides are known to be high-risk for G6PD deficiency."
      },
      {
        question: "Can you share medications with others who have G6PD deficiency?",
        options: [
          "Yes, if they have the same condition",
          "No, individual responses vary",
          "Only with family members",
          "Only with the same severity"
        ],
        correct: 1,
        explanation: "Individual responses to medications vary greatly among people with G6PD deficiency."
      }
    ]
  },
  "4": {
    title: "Emergency Recognition",
    description: "Identifying symptoms that require immediate attention",
    questions: [
      {
        question: "What are common symptoms of hemolytic anemia?",
        options: [
          "Increased energy",
          "Fatigue, jaundice, dark urine",
          "Weight gain",
          "Improved appetite"
        ],
        correct: 1,
        explanation: "Common symptoms include fatigue, jaundice (yellowing of skin/eyes), and dark urine due to hemoglobin breakdown."
      },
      {
        question: "When should you seek emergency medical care?",
        options: [
          "Never, it's not serious",
          "Only if you have a fever",
          "If you experience severe symptoms like difficulty breathing or extreme fatigue",
          "Only on weekdays"
        ],
        correct: 2,
        explanation: "Seek emergency care for severe symptoms like difficulty breathing, chest pain, or extreme fatigue."
      },
      {
        question: "What should you carry if you have severe G6PD deficiency?",
        options: [
          "Nothing special",
          "Medical alert information",
          "Only insurance card",
          "Snacks"
        ],
        correct: 1,
        explanation: "Carrying medical alert information can help emergency responders provide appropriate care."
      }
    ]
  }
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const moduleId = params.moduleId as string;
  const quiz = quizModules[moduleId as keyof typeof quizModules];

  if (!quiz) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <PageHeader
          eyebrow="ERROR"
          title="Quiz not found"
          subtitle="The requested quiz module does not exist"
        />
      </div>
    );
  }

  const handleAnswer = (answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === quiz.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setCompleted(true);
    setLoading(true);

    if (user) {
      try {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        await supabase
          .from('user_learning_progress')
          .upsert({
            user_id: user.id,
            module_id: moduleId,
            completed: true,
            quiz_score: percentage,
            updated_at: new Date().toISOString()
          });
      } catch (error) {
        console.error('Error saving quiz progress:', error);
      }
    }
    
    setLoading(false);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  const handleBackToLearn = () => {
    router.push('/learn');
  };

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const finalScore = Math.round((score / quiz.questions.length) * 100);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {!completed ? (
        <>
          <PageHeader
            eyebrow="EDUCATIONAL QUIZ"
            title={quiz.title}
            subtitle={quiz.description}
          />

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Question {currentQuestion + 1} of {quiz.questions.length}</span>
                  <span className="font-medium text-emerald-600">{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  {quiz.questions[currentQuestion].question}
                </h2>

                <div className="space-y-3">
                  {quiz.questions[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === quiz.questions[currentQuestion].correct;
                    const showResult = showExplanation && isSelected;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showResult
                            ? isCorrect
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-red-500 bg-red-50"
                            : isSelected
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900">{option}</span>
                          {showResult && (
                            <div className="flex items-center gap-2">
                              {isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {showExplanation && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-700">
                    <strong>Explanation:</strong> {quiz.questions[currentQuestion].explanation}
                  </p>
                  <Button
                    onClick={handleNext}
                    className="mt-4 w-full"
                  >
                    {currentQuestion < quiz.questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      "See Results"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <PageHeader
            eyebrow="QUIZ COMPLETE"
            title="Your Results"
            subtitle={loading ? "Saving your progress..." : "Here's how you did"}
          />

          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-emerald-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {finalScore}%
              </h2>
              <p className="text-slate-600 mb-6">
                You got {score} out of {quiz.questions.length} questions correct
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  disabled={loading}
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleBackToLearn}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Back to Learn
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Progress saved!</strong> Your quiz results have been recorded in your learning progress.
            </p>
          </div>
        </>
      )}
    </div>
  );
}