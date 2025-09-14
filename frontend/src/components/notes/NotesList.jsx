// src/components/notes/NotesList.jsx - Notes List Display
import React, { useState, useEffect } from 'react';
import { notesAPI } from '../../services/api';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const NotesList = ({ onPlanLimitReached }) => {
  const { isFreePlan } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError('');
      const notesData = await notesAPI.getAllNotes();
      setNotes(notesData);
    } catch (error) {
      setError('Failed to load notes');
      console.error('Load notes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    // Check plan limit for free users
    if (isFreePlan() && notes.length >= 3) {
      if (onPlanLimitReached) {
        onPlanLimitReached();
      }
      return;
    }
    
    setShowCreateForm(true);
    setEditingNote(null);
  };

  const handleNoteCreated = () => {
    setShowCreateForm(false);
    loadNotes(); // Refresh the list
  };

  const handleNoteUpdated = () => {
    setEditingNote(null);
    loadNotes(); // Refresh the list
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowCreateForm(false);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note._id !== noteId));
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingNote(null);
  };

  if (loading) {
    return <LoadingSpinner text="Loading notes..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isFreePlan() ? (
              <>
                {notes.length}/3 notes used
                {notes.length >= 3 && (
                  <span className="text-red-600 ml-2">
                    (Upgrade to Pro for unlimited notes)
                  </span>
                )}
              </>
            ) : (
              `${notes.length} notes`
            )}
          </p>
        </div>
        
        <button
          onClick={handleCreateNote}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Note
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Create/Edit Form */}
      {(showCreateForm || editingNote) && (
        <NoteForm
          note={editingNote}
          onSuccess={editingNote ? handleNoteUpdated : handleNoteCreated}
          onCancel={handleCancelForm}
          isEdit={!!editingNote}
        />
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first note to get started!
          </p>
          <button
            onClick={handleCreateNote}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Your First Note
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;