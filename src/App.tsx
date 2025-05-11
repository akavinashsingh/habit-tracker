import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { HabitProvider } from './contexts/HabitContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <HabitProvider>
        <Layout>
          <Dashboard />
        </Layout>
      </HabitProvider>
    </ThemeProvider>
  );
}

export default App;