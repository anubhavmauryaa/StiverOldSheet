import React, { createContext, useContext, useState, useEffect } from 'react';
import dsaData from '../data.json';

const DSAProgressContext = createContext();

export const useDSAProgress = () => {
  const context = useContext(DSAProgressContext);
  if (!context) {
    throw new Error('useDSAProgress must be used within a DSAProgressProvider');
  }
  return context;
};

export const DSAProgressProvider = ({ children }) => {
  const [steps, setSteps] = useState([]);
  const [completedProblems, setCompletedProblems] = useState(new Set());
  const [stats, setStats] = useState({
    totalProblems: 0,
    basicCount: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load DSA data from local JSON
  useEffect(() => {
    setSteps(dsaData);
    calculateStats();
    loadLocalProgress();
  }, []);

  const loadLocalProgress = () => {
    const localCompleted = localStorage.getItem('completedProblems');
    if (localCompleted) {
      try {
        const completedArray = JSON.parse(localCompleted);
        setCompletedProblems(new Set(completedArray));
      } catch (error) {
        console.error('Error loading local progress:', error);
        setCompletedProblems(new Set());
      }
    }
  };

  const calculateStats = () => {
    let totalProblems = 0;
    const difficultyCount = { 0: 0, 1: 0, 2: 0, 3: 0 };

    dsaData.forEach(step => {
      step.sub_steps.forEach(subStep => {
        subStep.topics.forEach(topic => {
          totalProblems++;
          const difficulty = topic.difficulty || 0;
          difficultyCount[difficulty]++;
        });
      });
    });

    setStats({
      totalProblems,
      basicCount: difficultyCount[0],
      easyCount: difficultyCount[1],
      mediumCount: difficultyCount[2],
      hardCount: difficultyCount[3],
      currentStreak: 0,
      longestStreak: 0
    });
  };

  const isProblemCompleted = (problemId) => {
    return completedProblems.has(problemId);
  };

  const markProblemCompleted = async (problemData) => {
    try {
      const newCompleted = new Set(completedProblems);
      
      if (newCompleted.has(problemData.id)) {
        // Remove if already completed (toggle off)
        newCompleted.delete(problemData.id);
      } else {
        // Add if not completed
        newCompleted.add(problemData.id);
      }
      
      setCompletedProblems(newCompleted);
      
      // Save to localStorage
      localStorage.setItem('completedProblems', JSON.stringify([...newCompleted]));
      
      return { success: true };
    } catch (error) {
      console.error('Error marking problem as completed:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleProblemCompletion = async (problemData) => {
    return await markProblemCompleted(problemData);
  };

  const removeProblemCompleted = async (problemId) => {
    try {
      const newCompleted = new Set(completedProblems);
      newCompleted.delete(problemId);
      setCompletedProblems(newCompleted);
      
      // Save to localStorage
      localStorage.setItem('completedProblems', JSON.stringify([...newCompleted]));
      
      return { success: true };
    } catch (error) {
      console.error('Error removing problem completion:', error);
      return { success: false, error: error.message };
    }
  };

  const getOverallProgress = () => {
    if (stats.totalProblems === 0) return 0;
    return Math.round((completedProblems.size / stats.totalProblems) * 100);
  };

  const getDifficultyProgress = () => {
    const progress = { basic: 0, easy: 0, medium: 0, hard: 0 };
    const completed = { basic: 0, easy: 0, medium: 0, hard: 0 };

    dsaData.forEach(step => {
      step.sub_steps.forEach(subStep => {
        subStep.topics.forEach(topic => {
          const difficultyMap = { 0: 'basic', 1: 'easy', 2: 'medium', 3: 'hard' };
          const difficulty = difficultyMap[topic.difficulty] || 'easy';
          
          if (completedProblems.has(topic.id)) {
            completed[difficulty]++;
          }
        });
      });
    });

    // Calculate percentages
    if (stats.basicCount > 0) progress.basic = Math.round((completed.basic / stats.basicCount) * 100);
    if (stats.easyCount > 0) progress.easy = Math.round((completed.easy / stats.easyCount) * 100);
    if (stats.mediumCount > 0) progress.medium = Math.round((completed.medium / stats.mediumCount) * 100);
    if (stats.hardCount > 0) progress.hard = Math.round((completed.hard / stats.hardCount) * 100);

    return { progress, completed };
  };

  const searchProblems = (searchTerm, filters = {}) => {
    if (!searchTerm) return [];
    
    const results = [];
    const searchLower = searchTerm.toLowerCase();

    dsaData.forEach(step => {
      step.sub_steps.forEach(subStep => {
        subStep.topics.forEach(topic => {
          // Apply filters
          if (filters.difficulty !== undefined && topic.difficulty !== filters.difficulty) return;
          if (filters.step_no && step.step_no !== filters.step_no) return;
          if (filters.sub_step_no && subStep.sub_step_no !== filters.sub_step_no) return;

          // Search in title and topics
          if (
            topic.question_title.toLowerCase().includes(searchLower) ||
            step.step_title.toLowerCase().includes(searchLower) ||
            subStep.sub_step_title.toLowerCase().includes(searchLower)
          ) {
            results.push({
              ...topic,
              step_title: step.step_title,
              sub_step_title: subStep.sub_step_title
            });
          }
        });
      });
    });

    return results;
  };

  const getProblemById = (problemId) => {
    for (const step of dsaData) {
      for (const subStep of step.sub_steps) {
        for (const topic of subStep.topics) {
          if (topic.id === problemId) {
            return {
              ...topic,
              step_title: step.step_title,
              sub_step_title: subStep.sub_step_title
            };
          }
        }
      }
    }
    return null;
  };

  const getStepProblems = (stepNo, subStepNo = null) => {
    const step = dsaData.find(s => s.step_no === stepNo);
    if (!step) return [];

    if (subStepNo) {
      const subStep = step.sub_steps.find(ss => ss.sub_step_no === subStepNo);
      return subStep ? subStep.topics : [];
    }

    // Return all topics from all sub-steps
    const allTopics = [];
    step.sub_steps.forEach(subStep => {
      allTopics.push(...subStep.topics);
    });
    return allTopics;
  };

  const value = {
    // Data
    dsaData,
    steps,
    completedProblems, // Return as Set
    stats,
    isLoading,

    // Actions
    markProblemCompleted,
    toggleProblemCompletion,
    removeProblemCompleted,
    searchProblems,
    getProblemById,
    getStepProblems,

    // Computed values
    isProblemCompleted,
    getOverallProgress,
    getDifficultyProgress,

    // Status
    isAuthenticated: false // No backend authentication
  };

  return (
    <DSAProgressContext.Provider value={value}>
      {children}
    </DSAProgressContext.Provider>
  );
};
