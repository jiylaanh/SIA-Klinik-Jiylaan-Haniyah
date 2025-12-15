import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import JournalEntry from './components/JournalEntry';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.AI_ASSISTANT);
  const [chatInputPayload, setChatInputPayload] = useState<{ text: string; timestamp: number } | null>(null);

  const handleNewEntry = () => {
    setCurrentView(ViewState.AI_ASSISTANT);
    // Use timestamp to force update even if the text is the same
    setChatInputPayload({ text: "Catat transaksi: ", timestamp: Date.now() });
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.AI_ASSISTANT:
        return <ChatInterface initialInput={chatInputPayload} />;
      case ViewState.JOURNAL:
        return <JournalEntry />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onNewEntry={handleNewEntry}
      />
      <main className="flex-1 h-full relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;