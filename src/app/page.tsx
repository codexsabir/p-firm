"use client";
import { useState } from "react";
import Cropper from "react-easy-crop";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", image!);

    const res = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Upload Numbers Image</h1>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      {image && (
        <button
          onClick={handleUpload}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Process Image
        </button>
      )}

      {result && (
        <div className="mt-6 text-left">
          {result.rows.map((row: any, idx: number) => (
            <div key={idx} className="mb-3">
              <h2 className="font-semibold">Row {idx + 1}</h2>
              <p>Numbers: {row.numbers.join(", ")}</p>
              <p>Total numbers: {row.count}</p>
              <p>Sum: {row.sum}</p>
            </div>
          ))}
          <h2 className="mt-4 text-xl font-bold">Grand Total: {result.grand_total}</h2>
        </div>
      )}
    </div>
  );
}
