import React from 'react';
import PageHeader from '../components/common/PageHeader';
import ChatInterface from '../components/ai/ChatInterface';

export const AiAssistantPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Network AI Assistant"
        subtitle="Conversational architecture advisor providing deep reasoning on VPC routing, Transit Gateway topologies, and security rules."
        breadcrumbs={[{ label: 'Intelligence' }, { label: 'AI Assistant' }]}
      />

      <ChatInterface />
    </div>
  );
};

export default AiAssistantPage;
