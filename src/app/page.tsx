"use client";
import { useState } from "react";

interface RowData {
  numbers: number[];
  count: number;
  sum: number;
  average: number;
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<string[]>([]);

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setEditingRow(null);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process image");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (rowIndex: number) => {
    setEditingRow(rowIndex);
    setEditedValues(result.rows[rowIndex].numbers.map((num: number) => num.toString()));
  };

  const cancelEditing = () => {
    setEditingRow(null);
    setEditedValues([]);
  };

  const saveEditing = () => {
    if (editingRow === null) return;

    const newRows = [...result.rows];
    const newNumbers = editedValues.map(value => {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }).filter(num => num !== 0); // Remove zeros if user wants to delete

    // Recalculate row stats
    const count = newNumbers.length;
    const sum = newNumbers.reduce((acc, num) => acc + num, 0);
    const average = count > 0 ? sum / count : 0;

    newRows[editingRow] = {
      numbers: newNumbers,
      count,
      sum,
      average
    };

    // Recalculate overall stats
    const total_count = newRows.reduce((acc, row) => acc + row.count, 0);
    const grand_total = newRows.reduce((acc, row) => acc + row.sum, 0);
    const overall_average = total_count > 0 ? grand_total / total_count : 0;

    setResult({
      ...result,
      rows: newRows,
      total_count,
      grand_total,
      overall_average
    });

    setEditingRow(null);
    setEditedValues([]);
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...editedValues];
    newValues[index] = value;
    setEditedValues(newValues);
  };

  const addNewValue = (rowIndex: number) => {
    const newValues = [...editedValues, ""];
    setEditedValues(newValues);
  };

  const removeValue = (valueIndex: number) => {
    const newValues = editedValues.filter((_, index) => index !== valueIndex);
    setEditedValues(newValues);
  };

  const addNewRow = () => {
    const newRow: RowData = {
      numbers: [0],
      count: 1,
      sum: 0,
      average: 0
    };

    const newRows = [...result.rows, newRow];
    const total_count = newRows.reduce((acc, row) => acc + row.count, 0);
    const grand_total = newRows.reduce((acc, row) => acc + row.sum, 0);
    const overall_average = total_count > 0 ? grand_total / total_count : 0;

    setResult({
      ...result,
      rows: newRows,
      total_count,
      grand_total,
      overall_average
    });
  };

  const deleteRow = (rowIndex: number) => {
    const newRows = result.rows.filter((_: any, index: number) => index !== rowIndex);

    if (newRows.length === 0) {
      setResult(null);
      return;
    }

    const total_count = newRows.reduce((acc: number, row: RowData) => acc + row.count, 0);
    const grand_total = newRows.reduce((acc: number, row: RowData) => acc + row.sum, 0);
    const overall_average = total_count > 0 ? grand_total / total_count : 0;

    setResult({
      ...result,
      rows: newRows,
      total_count,
      grand_total,
      overall_average
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AMIR UD DIN
          </h1>
          <p className="text-gray-600">
            Upload an image of a calculator page to extract and analyze numbers
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose an image of calculator page
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files?.[0] || null);
              setResult(null);
              setError(null);
              setEditingRow(null);
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {image && (
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-medium"
              >
                {loading ? "Analyzing..." : "Analyze Numbers"}
              </button>

              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                  setEditingRow(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
              <button
                onClick={addNewRow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              >
                + Add New Row
              </button>
            </div>

            {/* Row-by-row Results */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Row Analysis {editingRow !== null && "(Editing Mode)"}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {result.rows.map((row: RowData, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 relative">
                    {/* Edit/Delete Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      {editingRow === idx ? (
                        <>
                          <button
                            onClick={saveEditing}
                            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                            title="Save"
                          >
                            ✓
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(idx)}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteRow(idx)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                            title="Delete Row"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>

                    <h4 className="font-semibold text-blue-600 mb-3 pr-12">
                      Row {idx + 1}
                    </h4>

                    {editingRow === idx ? (
                      // Editing Mode
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600 mb-2 block">
                            Numbers (one per line):
                          </label>
                          <div className="space-y-2">
                            {editedValues.map((value, valueIndex) => (
                              <div key={valueIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => handleValueChange(valueIndex, e.target.value)}
                                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Enter number"
                                />
                                <button
                                  onClick={() => removeValue(valueIndex)}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addNewValue(idx)}
                              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                            >
                              + Add Number
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Numbers:</span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {row.numbers.map((num: number, i: number) => (
                              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Count:</span>
                          <span className="font-medium">{row.count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Row Sum:</span>
                          <span className="font-medium">{row.sum}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Row Average:</span>
                          <span className="font-medium">{row.average?.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Summary - Updates in real-time */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Overall Summary (Live Updates)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{result.total_count}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Numbers</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{result.grand_total}</div>
                  <div className="text-sm text-gray-600 mt-1">Grand Total</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.overall_average?.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Overall Average</div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-600">Total Rows</div>
                <div className="text-lg font-semibold">{result.rows?.length || 0}</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-600">Numbers per Row</div>
                <div className="text-lg font-semibold">
                  {result.rows?.length ? (result.total_count / result.rows.length).toFixed(1) : 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
}