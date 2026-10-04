import React from 'react';
import PageHeader from '../components/common/PageHeader';
import ChatInterface from '../components/ai/ChatInterface';

export const AiAssistantPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="CloudNexus Intelligence"
        subtitle="AI-powered network analysis and infrastructure guidance."
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'AI Assistant' }]}
      />

      <ChatInterface />
    </div>
  );
};

export default AiAssistantPage;
