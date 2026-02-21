import React from 'react';

export enum View {
  HOME = 'HOME',
  LESSON = 'LESSON',
  GAME = 'GAME',
  CHAT = 'CHAT',
  LEADERBOARD = 'LEADERBOARD',
  ARTICLES = 'ARTICLES',
  ADMIN = 'ADMIN'
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  author: string;
  created_at: string;
  slug: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: (onComplete: (points: number) => void, isCompleted: boolean) => React.ReactNode; // Changed to function prop accepting isCompleted
  difficulty: 'مبتدئ' | 'متوسط';
  duration: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface User {
  name: string;
  email: string;
  totalScore: number;
  badges: string[];
  completedLessons: string[]; // Track completed lesson IDs
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  isUser: boolean;
}