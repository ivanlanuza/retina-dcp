import { useState, useRef } from "react";
import { X, Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MassUploadSidebar({
  open,
  onClose,
  onUpload,
  instructions,
}) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid CSV file.");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split("\n");
      const headers = lines[0].split(",");
      const users = lines.slice(1).map((line, index) => {
        const values = line.split(",");
        const user = { id: String(index + 1) };
        headers.forEach((header, i) => {
          if (header.trim() === "tags") {
            user[header.trim()] = values[i].split(";").map((tag) => tag.trim());
          } else {
            user[header.trim()] = values[i].trim();
          }
        });
        return user;
      });
      onUpload(users);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Mass Upload</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">{instructions}</p>
        <div>
          <Label htmlFor="csvFile">Select CSV File</Label>
          <Input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
        {file && (
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4" />
            <span className="text-sm truncate">{file.name}</span>
          </div>
        )}
        <Button className="w-full" onClick={handleUpload} disabled={!file}>
          <Upload className="mr-2 h-4 w-4" /> Upload CSV
        </Button>
      </div>
    </div>
  );
}
