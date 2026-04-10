import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';

// ====== ЗАДАНИЯ =======
const easyTasks = [
  'Сделай 10 приседаний',
  'Пройди 1000 шагов',
  'Выпей стакан воды',
  'Почитай 5 минут',
  'Сделай 10 вдохов',
];

const mediumTasks = [
  '20 отжиманий',
  '5000 шагов',
  'Не ешь сладкое 1 день',
  'Тренировка 10 минут',
  '30 секунд планки',
];

const hardTasks = [
  'Холодный душ 🤪',
  '30 burpees 💪',
  'Доброе дело инкогнито',
  'Встань на 30 минут раньше',
  'Рассмеши друга',
];

// AI-фразы
const aiSuccess = ['Ты машина 💪', 'Реальный герой!', 'Каждый день растёшь!', 'Ну ты зверь!', 'Уважение от AI 🤖'];
const aiFail = ['Слабовато… давай ещё раз 😈', 'Может в следующий раз?', 'Где мотивация? 😏', 'AI грустит вместе с тобой'];

const levels = ['Новичок', 'Любитель', 'Ученик', 'Ас', 'Босс', 'Герой'];

// Случайное задание
const getRandomTask = () => {
  const type = Math.random();
  if (type < 0.5) return { text: easyTasks[Math.floor(Math.random() * easyTasks.length)], difficulty: 'easy' };
  if (type < 0.85) return { text: mediumTasks[Math.floor(Math.random() * mediumTasks.length)], difficulty: 'medium' };
  return { text: hardTasks[Math.floor(Math.random() * hardTasks.length)], difficulty: 'hard' };
};

const getRandomPhrase = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function App() {
  const [day, setDay] = useState(1);
  const [task, setTask] = useState(getRandomTask());
  const [taskStatus, setTaskStatus] = useState(null);
  const [streak, setStreak] = useState(0);
  const [tasksDone, setTasksDone] = useState(0);
  const [points, setPoints] = useState(0);
  const [showStats, setShowStats] = useState(false);

  const level = levels[Math.min(Math.floor(tasksDone / 5), levels.length - 1)];

  // Уведомление при старте
  useEffect(() => {
    const timer = setTimeout(() => {
      Alert.alert('Напоминание', 'Эй, ты забыл задание 😏');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setTaskStatus('success');
    setTasksDone(tasksDone + 1);
    setPoints(points + (task.difficulty === 'hard' ? 3 : task.difficulty === 'medium' ? 2 : 1));
    setStreak(streak + 1);
  };

  const handleSkip = () => {
    setTaskStatus('fail');
    setPoints(points > 0 ? points - 1 : 0);
    setStreak(0);
  };

  const handleNext = () => {
    setDay(day + 1);
    setTask(getRandomTask());
    setTaskStatus(null);
  };

  const handleReset = () => {
    setDay(1);
    setTask(getRandomTask());
    setTaskStatus(null);
    setTasksDone(0);
    setPoints(0);
    setStreak(0);
  };

  if (showStats) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.header}>📊 Статистика</Text>
        <Text style={styles.stats}>Дней подряд: {streak}</Text>
        <Text style={styles.stats}>Выполнено: {tasksDone}</Text>
        <Text style={styles.stats}>Очки: {points}</Text>
        <Text style={styles.stats}>Уровень: {level}</Text>
        <TouchableOpacity style={styles.bigButton} onPress={() => setShowStats(false)}>
          <Text style={styles.buttonText}>⬅️ Назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.header}>NeuroFit Challenge</Text>
      <Text style={styles.subHeader}>День {day} из 30</Text>
      <View style={styles.progressBarWrap}>
        <View style={[styles.progressBar, { width: `${Math.min((day/30)*100, 100)}%` }]} />
      </View>
      <View style={styles.taskBox}>
        <Text style={[styles.taskText, task.difficulty === 'easy' && { color: '#55c47a' }, task.difficulty === 'medium' && { color: '#f1c40f' }, task.difficulty === 'hard' && { color: '#e74c3c' }]}>{task.text}</Text>
        <Text style={styles.diffLabel}>{task.difficulty === 'easy' ? 'Лёгкое' : task.difficulty === 'medium' ? 'Среднее' : 'Жёсткое'}</Text>
      </View>
      {!taskStatus && (
        <>
          <TouchableOpacity style={styles.bigButton} onPress={handleComplete}>
            <Text style={styles.buttonText}>✅ Я сделал(а)!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bigButton, styles.skipButton]} onPress={handleSkip}>
            <Text style={styles.buttonText}>❌ Пропустить</Text>
          </TouchableOpacity>
        </>
      )}
      {taskStatus && (
        <>
          <Text style={styles.aiPhrase}>{taskStatus === 'success' ? getRandomPhrase(aiSuccess) : getRandomPhrase(aiFail)}</Text>
          <TouchableOpacity style={styles.bigButton} onPress={handleNext}>
            <Text style={styles.buttonText}>➡️ Следующий день</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.statsBtn} onPress={() => setShowStats(true)}>
        <Text style={{ color: '#888' }}>📈 Статистика</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={{ color: '#d88585', fontSize: 13 }}>Сбросить прогресс</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  header: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subHeader: { color: '#bbb', fontSize: 18, marginBottom: 8 },
  progressBarWrap: { height: 12, width: '95%', backgroundColor: '#2a2a2a', borderRadius: 7, marginBottom: 20, overflow: 'hidden' },
  progressBar: { height: 12, backgroundColor: '#47f487', borderRadius: 7 },
  taskBox: { backgroundColor: '#222', padding: 26, borderRadius: 18, marginBottom: 22, alignItems: 'center', minWidth: '98%' },
  taskText: { fontSize: 23, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  diffLabel: { color: '#888', fontSize: 14 },
  bigButton: { backgroundColor: '#232323', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 45, alignItems: 'center', marginVertical: 6, width: '95%' },
  skipButton: { borderColor: '#faa', borderWidth: 1.5, backgroundColor: '#181818' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 },
  aiPhrase: { marginTop: 25, fontSize: 20, color: '#70e0fa', textAlign: 'center', marginBottom: 18, fontStyle: 'italic' },
  statsBtn: { marginTop: 22, padding: 4 },
  stats: { color: '#e2e2e2', fontSize: 20, marginVertical: 11 },
  resetBtn: { padding: 2, marginTop: 14 },
});