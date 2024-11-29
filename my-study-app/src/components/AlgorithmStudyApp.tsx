import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, X, Edit2 } from 'lucide-react';
import MathContent from './MathContent';

const topics = [
  'Time Complexity',
  'Graph',
  'Heaps',
  'Master Theorem',
  'Amortized Analysis',
  'Sorting Algorithms',
];

const TopicContent = ({ title, sections, onAddSection, onRemoveSection, onEditSection, searchTerm }) => {
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const filteredSections = useMemo(() => {
    if (!searchTerm) return sections;
    return sections.filter(section =>
      section.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sections, searchTerm]);

  const handleSave = () => {
    if (newContent.trim()) {
      if (editingIndex !== null) {
        onEditSection(title, editingIndex, newContent);
        setEditingIndex(null);
      } else {
        onAddSection(title, newContent);
      }
      setNewContent('');
      setIsAdding(false);
    }
  };

  const startEditing = (index, content) => {
    setNewContent(content);
    setEditingIndex(index);
    setIsAdding(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
  
      <div className="space-y-4 mb-6">
        {filteredSections?.length === 0 && searchTerm && (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
            No content found matching "{searchTerm}" in {title}
          </div>
        )}
        {filteredSections.map((section, index) => (
          <div 
            key={index}
            className="relative p-4 border rounded-lg border-l-4 border-l-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow"
            onClick={() => !isAdding && startEditing(index, section)}
            style={{ cursor: isAdding ? 'default' : 'pointer' }}
          >
            {isAdding && editingIndex === index ? (
              <div className="mb-4 p-4">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2 min-h-[500px] border rounded-lg mb-4 font-mono text-sm text-black"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAdding(false);
                      setEditingIndex(null);
                      setNewContent('');
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(index, section);
                    }}
                    className="p-1 text-gray-500 hover:text-blue-500"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSection(title, index);
                    }}
                    className="p-1 text-gray-500 hover:text-red-500"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="whitespace-pre-wrap pt-2 text-gray-700 font-medium">
  <MathContent content={section} />
</div>
              </>
            )}
          </div>
        ))}
      </div>
  
      {/* Add Content section moved to bottom */}
      <div className="border-t pt-6">
        {!isAdding && (
          <button 
            onClick={() => {
              setIsAdding(true);
              setEditingIndex(null);
              setNewContent('');
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 justify-center"
          >
            <PlusCircle className="w-4 h-4" />
            Add Content
          </button>
        )}
  
        {isAdding && editingIndex === null && (
          <div className="border rounded-lg bg-white shadow">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter your content here... Use \[ \] for display math and \( \) for inline math"
              className="w-full p-4 min-h-[400px] border-b rounded-t-lg font-mono text-sm text-black"
              autoFocus
            />
            <div className="flex justify-end gap-2 p-4">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewContent('');
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AlgorithmStudyApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [allContent, setAllContent] = useState(() => {
    // Initialize with empty arrays for all topics
    return topics.reduce((acc, topic) => {
      acc[topic] = [];
      return acc;
    }, {});
  });
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200); // Show button when scrolled down 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // 1. First useEffect - Load initial data
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        if (Object.keys(data).length > 0) {  // Only update if we have data
          const initialContent = topics.reduce((acc, topic) => {
            acc[topic] = data[topic] || [];  // Keep existing data or initialize empty
            return acc;
          }, { ...data });  // Start with existing data
          setAllContent(initialContent);
        }
      })
      .catch(error => {
        console.error('Error loading notes:', error);
      });
  }, []);

  // 2. Second useEffect - Handle topic changes
  useEffect(() => {
    setAllContent(prev => {
      const newContent = { ...prev };
      // Only add new topics, don't reset existing ones
      topics.forEach(topic => {
        if (!newContent[topic]) {
          newContent[topic] = [];
        }
      });
      return newContent;
    });
  }, [topics]);

  // 3. Third useEffect - Save changes to file
  useEffect(() => {
    if (Object.keys(allContent).length > 0) {
      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allContent),
      }).catch(error => {
        console.error('Error saving notes:', error);
      });
    }
  }, [allContent]);

  const handleAddSection = (topic, content) => {
    setAllContent(prev => ({
      ...prev,
      [topic]: [...prev[topic], content]
    }));
  };

  const handleRemoveSection = (topic, index) => {
    setAllContent(prev => ({
      ...prev,
      [topic]: prev[topic].filter((_, i) => i !== index)
    }));
  };

  const handleEditSection = (topic, index, newContent) => {
    setAllContent(prev => ({
      ...prev,
      [topic]: prev[topic].map((content, i) => i === index ? newContent : content)
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasMatchingContent = useMemo(() => {
    if (!searchTerm) return true;
    return Object.values(allContent).some(sections =>
      sections.some(section =>
        section.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [allContent, searchTerm]);

  const exportWithTimestamp = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dataStr = JSON.stringify(allContent, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `algorithm_study_notes_${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Algorithm Analysis Study Guide
        </h1>

        <div className="flex justify-between items-center max-w-md mx-auto mb-8">
          <div className="relative flex-grow">
            <input
              type="search"
              placeholder="Search all topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 py-2 pr-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
            />
          </div>
          <button
            onClick={exportWithTimestamp}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export Notes
          </button>
        </div>

        {!hasMatchingContent && (
          <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-center shadow-sm">
            No content found matching "{searchTerm}" in any topic
          </div>
        )}

        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedTopic === topic
                ? 'bg-blue-600 text-white shadow-md'
                : 'border bg-white hover:bg-gray-50 text-black'
                }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <TopicContent
          title={selectedTopic}
          sections={allContent[selectedTopic]}
          onAddSection={handleAddSection}
          onRemoveSection={handleRemoveSection}
          onEditSection={handleEditSection}
          searchTerm={searchTerm}
        />
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
          style={{ zIndex: 1000 }}
          title="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AlgorithmStudyApp;
