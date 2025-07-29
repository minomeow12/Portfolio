'use client';

import { useState } from 'react';
import { shuffleArray } from '../../utils/shuffle';

export default function ExamRandomizerPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [shuffled, setShuffled] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');

  // Shuffle questions and their options using your existing shuffle utility
  const shuffleQuestions = (questionsArray: any[]) => {
    return questionsArray.map(question => ({
      ...question,
      options: question.options ? shuffleArray([...question.options]) : question.options
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json')) {
      setError('Please select a valid JSON file (.json extension required)');
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        try {
          setError(null);
          setLoading(true);

          if (result.trim().startsWith('<!DOCTYPE') || result.trim().startsWith('<html')) {
            throw new Error('The uploaded file appears to be an HTML document, not JSON.');
          }

          if (result.trim().length < 2) {
            throw new Error('The uploaded file appears to be empty or invalid.');
          }

          setFileContent(result.substring(0, 500));
          const json = JSON.parse(result);
          console.log("📦 Parsed Questions:", json);
          setQuestions(json);

          // Client-side shuffling using your existing shuffle utility
          const shuffledQuestions = shuffleArray(shuffleQuestions(json));
          console.log("🔀 Shuffled Questions:", shuffledQuestions);
          setShuffled(shuffledQuestions);

        } catch (error) {
          console.error('❌ Error:', error);
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    reader.readAsText(file);
  };

  const handleReshuffle = () => {
    if (questions.length > 0) {
      const reshuffled = shuffleArray(shuffleQuestions(questions));
      setShuffled(reshuffled);
      console.log("🔄 Reshuffled Questions:", reshuffled);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        {/* 🔍 Header: Upload + Buttons */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Exam Randomizer</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => window.location.reload()}>
              <i className="fas fa-sync-alt"></i>
            </button>
            {shuffled.length > 0 && (
              <button className="btn btn-outline-primary" onClick={handleReshuffle}>
                <i className="fas fa-random"></i> Reshuffle
              </button>
            )}
            <label className="btn btn-primary mb-0">
              <i className="fas fa-upload"></i> Upload JSON
              <input type="file" accept=".json" hidden onChange={handleFileChange} disabled={loading} />
            </label>
          </div>
        </div>

        {/* 🧾 Body */}
        <div className="card-body">
          {loading && <div className="alert alert-info">Loading...</div>}

          {error && (
            <div className="alert alert-danger">
              <strong>Error:</strong> {error}
              {fileContent && (
                <details className="mt-2">
                  <summary className="cursor-pointer fw-bold">File Preview</summary>
                  <pre className="mt-2 small bg-light p-2 border rounded">{fileContent}</pre>
                </details>
              )}
            </div>
          )}

          {/* 📋 Original Questions Table */}
          {questions.length > 0 && (
            <>
              <h6 className="mt-4">Original Questions ({questions.length})</h6>
              <table className="table table-bordered table-hover mt-2">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{q.question}</td>
                      <td>{q.answer}</td>
                      <td>{q.options?.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* 🔀 Shuffled Questions Table */}
          {shuffled.length > 0 && (
            <>
              <h6 className="mt-4">Shuffled Questions ({shuffled.length})</h6>
              <table className="table table-bordered table-hover mt-2">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Answer</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {shuffled.map((q: any, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{q.question}</td>
                      <td>{q.answer}</td>
                      <td>{q.options?.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}