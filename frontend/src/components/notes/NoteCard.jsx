// src/components/notes/NoteCard.jsx - Individual Note Display Card
import React, { useState } from 'react';
import { notesAPI } from '../../services/api';
import { InlineSpinner } from '../ui/LoadingSpinner';

const NoteCard = ({ note, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await notesAPI.deleteNote(note._id);
      if (onDelete) {
        onDelete(note._id);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    } finally {
      setDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Note Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900 truncate pr-4">
          {note.title}
        </h3>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            disabled={deleting}
          >
            Edit
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            disabled={deleting}
          >
            {deleting ? <InlineSpinner /> : 'Delete'}
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm whitespace-pre-wrap">
          {truncateContent(note.content)}
        </p>
      </div>

      {/* Note Metadata */}
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>
          By {note.createdBy?.email || 'Unknown'}
        </span>
        <span>
          {formatDate(note.createdAt)}
        </span>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Note
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{note.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting && <InlineSpinner />}
                  <span className={deleting ? 'ml-2' : ''}>
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteCard;