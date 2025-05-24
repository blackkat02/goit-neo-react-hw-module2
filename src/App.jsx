import { useState, useEffect } from 'react';
import Description from './components/Description/Description';
import Options from './components/Options/Options';
import Feedback from './components/Feedback/Feedback';
import Notification from './components/Notification/Notification';
import styles from './App.module.css';

const App = () => {
  const [feedback, setFeedback] = useState(() => {
    try {
      const savedFeedback = localStorage.getItem("feedbackData");
      return savedFeedback 
        ? JSON.parse(savedFeedback)
        : { good: 0, neutral: 0, bad: 0 };
    } catch (error) {
      console.error("Помилка при читанні з localStorage:", error);
      return { good: 0, neutral: 0, bad: 0 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("feedbackData", JSON.stringify(feedback));
    } catch (error) {
      console.error("Помилка при збереженні в localStorage:", error);
    }
  }, [feedback]);

  const totalFeedback = feedback.good + feedback.neutral + feedback.bad;
  const positive = Math.round((feedback.good / totalFeedback) * 100)

  const updateFeedback = feedbackType => {
    setFeedback(prevState => ({
      ...prevState,
      [feedbackType]: prevState[feedbackType] + 1,
    }));
  };

  const resetFeedback = () => {
    setFeedback({
      good: 0,
      neutral: 0,
      bad: 0,
    });
  };

  return (
    <div className={styles.container}>
      <Description />
      <Options 
        onUpdateFeedback={updateFeedback}
        onResetFeedback={resetFeedback}
        totalFeedback={totalFeedback}
      />
      {totalFeedback > 0 ? (
        <Feedback
          good={feedback.good}
          neutral={feedback.neutral}
          bad={feedback.bad}
          totalFeedback={totalFeedback}
          positive={positive}
        />
      ) : (
        <Notification />
      )}
    </div>
  );
};

export default App;