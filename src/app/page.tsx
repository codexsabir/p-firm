"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
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
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
              Analysis Results
            </h2>

            {/* Row-by-row Results */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Row Analysis
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {result.rows && result.rows.map((row: any, idx: number) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-600 mb-3">
                      Row {idx + 1}
                    </h4>
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
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Overall Summary
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