import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Play,
  BookOpen,
  Code,
  Trophy,
  Clock,
  Target,
  Check,
  Star,
  Plus,
  FileText,
  Youtube,
  Moon,
  Sun,
  LogOut,
  User,
} from "lucide-react";
import "./App.css";
import courseData from "./data.json";

// Import components
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DSAProgressProvider, useDSAProgress } from "./contexts/DSAProgressContext";

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const DifficultyBadge = ({ difficulty }) => {
  const { isDark } = useTheme();
  
  const getDifficultyConfig = (diff) => {
    const baseClasses = isDark ? "text-white" : "";
    switch (diff) {
      case 0:
        return { 
          color: isDark 
            ? "bg-gray-700 text-gray-300" 
            : "text-gray-600 bg-gray-100", 
          label: "Basic" 
        };
      case 1:
        return { 
          color: isDark 
            ? "bg-green-800 text-green-200" 
            : "text-green-600 bg-green-100", 
          label: "Easy" 
        };
      case 2:
        return { 
          color: isDark 
            ? "bg-yellow-800 text-yellow-200" 
            : "text-yellow-600 bg-yellow-100", 
          label: "Medium" 
        };
      case 3:
        return { 
          color: isDark 
            ? "bg-red-800 text-red-200" 
            : "text-red-600 bg-red-100", 
          label: "Hard" 
        };
      default:
        return { 
          color: isDark 
            ? "bg-gray-700 text-gray-300" 
            : "text-gray-600 bg-gray-100", 
          label: "Unknown" 
        };
    }
  };

  const config = getDifficultyConfig(difficulty);
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

const YouTubeIcon = () => (
  <svg
    width="29"
    height="20"
    viewBox="0 0 29 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <g>
      <path
        d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"
        fill="#FF0033"
      />
      <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white" />
    </g>
  </svg>
);

const TopicRow = ({
  topic,
  index,
  isCompleted,
  onToggleComplete,
  onToggleRevision,
  onToggleNote,
}) => {
  const { isDark } = useTheme();
  
  return (
    <tr className={`border-b transition-colors ${
      isDark 
        ? "border-gray-700 hover:bg-gray-800" 
        : "border-gray-200 hover:bg-gray-50"
    }`}>
      {/* Status Checkbox */}
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => onToggleComplete(topic.id)}
          className={`w-4 h-4 text-orange-600 rounded focus:ring-orange-500 ${
            isDark 
              ? "bg-gray-700 border-gray-600" 
              : "bg-gray-100 border-gray-300"
          }`}
        />
      </td>

      {/* Problem Name */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <span className={`font-medium ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}>
            {topic.question_title}
          </span>
          {topic.plus_link && (
            <a
              href={topic.plus_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-600"
            ></a>
          )}
        </div>
      </td>

      {/* article */}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          {topic.post_link && (
            <a
              href={topic.post_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8"
              title="Article"
            >
              <img
                src="https://takeuforward.org/static/media/editorialFree.ac0387cc52a6341faa2fdb5511d0666e.svg"
                alt="TakeUForward Editorial Free Icon"
                class="w-6 h-6"
              />
            </a>
          )}
        </div>
      </td>
      {/* video */}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          {topic.yt_link && (
            <a
              href={topic.yt_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-8 h-8"
              title="Video"
            >
              <YouTubeIcon />
            </a>
          )}
          {!topic.yt_link && <span className="text-gray-400">-</span>}
        </div>
      </td>

      {/* LeetCode */}
      <td className="px-4 py-4 text-center">
        {topic.lc_link ? (
          <a
            href={topic.lc_link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-6 h-6 rounded transition-colors ${
              isDark 
                ? "hover:bg-gray-700" 
                : "hover:bg-green-50"
            }`}
            title="LeetCode"
          >
            <svg
              width="95"
              height="111"
              viewBox="0 0 95 111"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-full w-auto max-w-none"
            >
              <path
                d="M68.0063 83.0664C70.5 80.5764 74.5366 80.5829 77.0223 83.0809C79.508 85.579 79.5015 89.6226 77.0078 92.1127L65.9346 103.17C55.7187 113.371 39.06 113.519 28.6718 103.513C28.6117 103.456 23.9861 98.9201 8.72653 83.957C-1.42528 74.0029 -2.43665 58.0749 7.11648 47.8464L24.9282 28.7745C34.4095 18.6219 51.887 17.5122 62.7275 26.2789L78.9048 39.362C81.6444 41.5776 82.0723 45.5985 79.8606 48.3429C77.6488 51.0873 73.635 51.5159 70.8954 49.3003L54.7182 36.2173C49.0488 31.6325 39.1314 32.2622 34.2394 37.5006L16.4274 56.5727C11.7767 61.5522 12.2861 69.574 17.6456 74.8292C28.851 85.8169 37.4869 94.2846 37.4969 94.2942C42.8977 99.496 51.6304 99.4184 56.9331 94.1234L68.0063 83.0664Z"
                fill="#FFA116"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M41.1067 72.0014C37.5858 72.0014 34.7314 69.1421 34.7314 65.615C34.7314 62.0879 37.5858 59.2286 41.1067 59.2286H88.1245C91.6454 59.2286 94.4997 62.0879 94.4997 65.615C94.4997 69.1421 91.6454 72.0014 88.1245 72.0014H41.1067Z"
                fill="#B3B3B3"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M49.9118 2.02335C52.3173 -0.55232 56.3517 -0.686894 58.9228 1.72277C61.494 4.13244 61.6284 8.17385 59.2229 10.7495L16.4276 56.5729C11.7768 61.552 12.2861 69.5738 17.6453 74.8292L37.4088 94.2091C39.9249 96.6764 39.968 100.72 37.505 103.24C35.042 105.761 31.0056 105.804 28.4895 103.337L8.72593 83.9567C-1.42529 74.0021 -2.43665 58.0741 7.1169 47.8463L49.9118 2.02335Z"
                fill="black"
              ></path>
            </svg>
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>

      {/* GeeksforGeeks */}
      <td className="px-4 py-4 text-center">
        {topic.gfg_link ? (
          <a
            href={topic.gfg_link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-6 h-6 rounded transition-colors ${
              isDark 
                ? "hover:bg-gray-700" 
                : "hover:bg-green-50"
            }`}
            title="GeeksforGeeks"
          >
            <img
              className="gfgLogoImg normal transition-transform duration-200 hover:scale-110"
              src="https://media.geeksforgeeks.org/gfg-gg-logo.svg"
              alt="geeksforgeeks"
              width="24"
              height="24"
            />
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-4 py-4 text-center">
        {topic.cs_link ? (
          <a
            href={topic.cs_link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center w-6 h-6 rounded transition-colors ${
              isDark 
                ? "hover:bg-gray-700" 
                : "hover:bg-green-50"
            }`}
            title="Coding Ninjas"
          >
            <img
              src="https://dmmy6mpbxgeck.cloudfront.net/68b82ab2-3e36-4428-aa21-6e5e2cd407c5/widget/8f96fa5f-3a91-4de7-8881-c62376b37acf"
              width="100%"
              height="100%"
            ></img>
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>

      {/* Note */}
      <td className="px-4 py-4 text-center">
        <button
          onClick={() => onToggleNote(topic.id)}
          className={`inline-flex items-center justify-center w-8 h-8 rounded transition-colors ${
            isDark 
              ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" 
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
          title="Add Note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </td>

      {/* Revision */}
      <td className="px-4 py-4 text-center">
        <button
          onClick={() => onToggleRevision(topic.id)}
          className={`inline-flex items-center justify-center w-8 h-8 rounded transition-colors ${
            isDark 
              ? "text-gray-500 hover:text-yellow-400 hover:bg-yellow-900/20" 
              : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
          }`}
          title="Mark for Revision"
        >
          <Star className="w-4 h-4" />
        </button>
      </td>

      {/* Difficulty */}
      <td className="px-4 py-4 text-center">
        <DifficultyBadge difficulty={topic.difficulty} />
      </td>
    </tr>
  );
};

const SubStepSection = ({ 
  subStep, 
  stepIndex, 
  subStepIndex 
}) => {
  const { isDark } = useTheme();
  const { isProblemCompleted, toggleProblemCompletion } = useDSAProgress();
  const [isExpanded, setIsExpanded] = useState(false);
  const [revisionTopics, setRevisionTopics] = useState(new Set());
  const [noteTopics, setNoteTopics] = useState(new Set());

  const handleToggleRevision = (topicId) => {
    const newRevision = new Set(revisionTopics);
    if (newRevision.has(topicId)) {
      newRevision.delete(topicId);
    } else {
      newRevision.add(topicId);
    }
    setRevisionTopics(newRevision);
  };

  const handleToggleNote = (topicId) => {
    const newNotes = new Set(noteTopics);
    if (newNotes.has(topicId)) {
      newNotes.delete(topicId);
    } else {
      newNotes.add(topicId);
    }
    setNoteTopics(newNotes);
  };

  // Count completed topics for this substep from global state
  const completedInSubStep = subStep.topics.filter(topic => 
    isProblemCompleted(topic.id)
  ).length;
  
  const completionPercentage = Math.round(
    (completedInSubStep / subStep.topics.length) * 100
  );

  return (
    <div className={`rounded-lg border mb-6 overflow-hidden shadow-sm ${
      isDark 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-200"
    }`}>
      <div 
        className={`p-4 cursor-pointer transition-colors border-b ${
          isDark 
            ? "hover:bg-gray-700 border-gray-700" 
            : "hover:bg-gray-50 border-gray-100"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
              {stepIndex}.{subStepIndex}
            </span>
            <div>
              <h2 className={`text-lg font-semibold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                {subStep.sub_step_title}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {subStep.topics.length} problems
                </span>
                <span className="text-sm text-green-600 font-medium">
                  {completedInSubStep} completed
                </span>
                <div className={`w-32 rounded-full h-2 ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}>
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {completionPercentage}%
                </span>
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className={`w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`} />
          ) : (
            <ChevronRight className={`w-5 h-5 ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`} />
          )}
        </div>
      </div>      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Problem
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Article
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Video
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  LeetCode
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  GeeksforGeeks
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Coding Ninjas
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Note
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Revision
                </th>
                <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody className={isDark ? "bg-gray-800" : "bg-white"}>
              {subStep.topics.map((topic, topicIndex) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  index={topicIndex}
                  isCompleted={isProblemCompleted(topic.id)}
                  onToggleComplete={() => toggleProblemCompletion(topic)}
                  onToggleRevision={handleToggleRevision}
                  onToggleNote={handleToggleNote}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const StepSection = ({ 
  step, 
  index, 
  viewType = "table"
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const totalTopics = step.sub_steps.reduce(
    (sum, subStep) => sum + subStep.topics.length,
    0
  );

  return (
    <div className={`rounded-lg shadow-sm border mb-6 overflow-hidden ${
      isDark 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-200"
    }`}>
      <div 
        className={`p-6 cursor-pointer transition-colors border-b ${
          isDark 
            ? "hover:bg-gray-700 border-gray-700" 
            : "hover:bg-gray-50 border-gray-100"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-lg text-lg font-bold">
              {step.step_no}
            </span>
            <div>
              <h1 className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                {step.step_title}
              </h1>
              <div className="flex items-center space-x-6 mt-2">
                <span className={`flex items-center space-x-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  <Target className="w-4 h-4" />
                  <span className="text-sm">
                    {step.sub_steps.length} sections
                  </span>
                </span>
                <span className={`flex items-center space-x-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{totalTopics} problems</span>
                </span>
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className={`w-6 h-6 ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`} />
          ) : (
            <ChevronRight className={`w-6 h-6 ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`} />
          )}
        </div>
      </div>      {isExpanded && (
        <div className="p-6">
          <div className="space-y-6">
            {step.sub_steps.map((subStep, subStepIndex) => (
              <SubStepSection
                key={subStep.sub_step_no}
                subStep={subStep}
                stepIndex={step.step_no}
                subStepIndex={subStep.sub_step_no}
                viewType={viewType}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressStats = ({ data, completedProblems = new Set() }) => {
  const { isDark } = useTheme();
  const totalSteps = data.length;
  const totalSubSteps = data.reduce(
    (sum, step) => sum + step.sub_steps.length,
    0
  );
  
  // Calculate total topics and difficulty breakdown
  const topicsByDifficulty = { 0: 0, 1: 0, 2: 0, 3: 0 }; // Basic, Easy, Medium, Hard
  const completedByDifficulty = { 0: 0, 1: 0, 2: 0, 3: 0 };
  
  let totalTopics = 0;
  
  data.forEach(step => {
    step.sub_steps.forEach(subStep => {
      subStep.topics.forEach(topic => {
        totalTopics++;
        const difficulty = topic.difficulty || 0;
        topicsByDifficulty[difficulty]++;
        
        if (completedProblems.has(topic.id)) {
          completedByDifficulty[difficulty]++;
        }
      });
    });
  });

  const totalCompleted = completedProblems.size;
  const overallProgress = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  const difficultyStats = [
    {
      label: "Easy",
      completed: completedByDifficulty[1],
      total: topicsByDifficulty[1],
      color: "bg-green-500",
      bgColor: isDark ? "bg-green-900/20" : "bg-green-100",
      textColor: isDark ? "text-green-400" : "text-green-600"
    },
    {
      label: "Medium", 
      completed: completedByDifficulty[2],
      total: topicsByDifficulty[2],
      color: "bg-yellow-500",
      bgColor: isDark ? "bg-yellow-900/20" : "bg-yellow-100",
      textColor: isDark ? "text-yellow-400" : "text-yellow-600"
    },
    {
      label: "Hard",
      completed: completedByDifficulty[3], 
      total: topicsByDifficulty[3],
      color: "bg-red-500",
      bgColor: isDark ? "bg-red-900/20" : "bg-red-100",
      textColor: isDark ? "text-red-400" : "text-red-600"
    }
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Overall Progress */}
      <div className={`rounded-lg shadow-sm border p-6 ${
        isDark 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              Total Progress
            </h2>
            <p className={`text-3xl font-bold mt-2 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              {totalCompleted} / {totalTopics}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}>
              {overallProgress}%
            </div>
            <div className={`w-24 h-3 rounded-full mt-2 ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}>
              <div
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficultyStats.map((stat, index) => {
          const progress = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
          return (
            <div
              key={index}
              className={`rounded-lg shadow-sm border p-4 ${
                isDark 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold ${stat.textColor}`}>
                  {stat.label}
                </h3>
                <span className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}>
                  {progress}%
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-bold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}>
                  {stat.completed} / {stat.total}
                </span>
                <span className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}>
                  completed
                </span>
              </div>
              <div className={`w-full h-2 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <div
                  className={`${stat.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { 
    dsaData, 
    steps,
    completedProblems, 
    isProblemCompleted, 
    markProblemCompleted, 
    getOverallProgress,
    getDifficultyProgress,
    isLoading 
  } = useDSAProgress();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedView, setSelectedView] = useState("table"); // 'table' or 'card'

  // Update filtered data when steps changes
  useEffect(() => {
    setFilteredData(steps);
  }, [steps]);

  const handleGlobalToggleComplete = async (topicData) => {
    try {
      if (isProblemCompleted(topicData.id)) {
        // If already completed, you could implement removal here
        console.log('Problem already completed:', topicData.question_title);
      } else {
        const result = await markProblemCompleted(topicData);
        if (result.success) {
          console.log('Problem marked as completed:', topicData.question_title);
        } else {
          console.error('Failed to mark problem as completed:', result.error);
        }
      }
    } catch (error) {
      console.error('Error toggling problem completion:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(steps);
    } else {
      const filtered = steps.filter((step) => {
        // Search in step title
        if (step.step_title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        
        // Search in sub-steps and topics
        return step.sub_steps.some(subStep => 
          subStep.sub_step_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subStep.topics.some(topic => 
            topic.question_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (topic.ques_topic && topic.ques_topic.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, steps]);

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <div className="container mx-auto  px-4 py-6 max-w-7xl">
        {/* Header */}

          <div className="flex items-center justify-end mb-4">
            
            <div className="flex items-center space-x-2">
                {/*check authentication status*/}
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${
                    isDark 
                      ? "bg-gray-700 text-gray-300" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    <User className="w-5 h-5" />
                    <span className="font-medium">Welcome, {user?.name || 'User'}</span>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  {/* Login/Signup Buttons for non-authenticated users */}
                  <a
                    href="/login"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Sign Up
                  </a>
                </>
              )}
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
            </div>
          </div>




        {/* Progress Stats */}

        <ProgressStats data={filteredData} completedProblems={completedProblems} />

        {/* Course Content */}
        <div className="space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map((step, index) => (
              <StepSection
                key={step.step_no}
                step={step}
                index={index}
                viewType={selectedView}
              />
            ))
          ) : (
            <div className={`rounded-lg shadow-sm border p-12 text-center ${
              isDark 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            }`}>
              <div className={`mb-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}>
                <BookOpen className="w-16 h-16 mx-auto" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
                No results found
              </h3>
              <p className={isDark ? "text-gray-500" : "text-gray-500"}>
                Try searching for different keywords or browse all topics.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center py-6 border-t ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Made with ❤️ for DSA learners. Course content by{" "}
            <a
              href="https://takeuforward.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 font-semibold"
            >
              TakeUforward
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main App component with Theme Provider and Authentication
function App() {
  return (
    <AuthProvider>
      <DSAProgressProvider>
        <ThemeProvider>
          <Router>
            <AppRouter />
          </Router>
        </ThemeProvider>
      </DSAProgressProvider>
    </AuthProvider>
  );
}

// Router component to handle authentication routing
function AppRouter() {
  const { isDark } = useTheme();
  const { login, signup } = useAuth();

  const handleLogin = async (userData) => {
    await login(userData);
  };

  const handleSignup = async (userData) => {
    await signup(userData);
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Login onLogin={handleLogin} isDark={isDark} />} 
      />
      <Route 
        path="/signup" 
        element={<Signup onSignup={handleSignup} isDark={isDark} />} 
      />
      <Route 
        path="/" 
        element={<AppContent />} 
      />
      <Route 
        path="/dashboard" 
        element={<AppContent />} 
      />
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
}

export default App;
