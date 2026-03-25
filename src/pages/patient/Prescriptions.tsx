import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Check, Loader2, Eye, Trash2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { mockPrescriptions } from '@/lib/mock-data';
import { apiClient } from '@/lib/api-client';

interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  confidence: number;
}

export default function Prescriptions() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractionStage, setExtractionStage] = useState(0);
  const [medicines, setMedicines] = useState<ExtractedMedicine[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const stages = [
    { label: 'Uploading image...', icon: '📤' },
    { label: 'Reading prescription...', icon: '👁️' },
    { label: 'Extracting medicines with AI...', icon: '🤖' },
    { label: 'Validating drug database...', icon: '💊' },
    { label: 'Done!', icon: '✅' },
  ];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
      handleExtractPrescription(file);
    },
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
  });

  const handleExtractPrescription = async (file: File) => {
    setExtracting(true);
    setExtractionStage(0);

    try {
      // Simulate stages
      for (let i = 0; i < stages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setExtractionStage(i + 1);
      }

      // Call API
      const response = await apiClient.extractPrescription(file);
      setMedicines(response.data.medicines || []);
      toast.success('Prescription extracted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to extract prescription');
      setMedicines([]);
    } finally {
      setExtracting(false);
      setExtractionStage(0);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-success/10 text-success';
    if (confidence >= 75) return 'bg-primary/10 text-primary';
    return 'bg-warning/10 text-warning';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 90) return 'High';
    if (confidence >= 75) return 'Medium';
    return 'Low';
  };

  return (
    <div>
      <AppHeader title="Prescriptions" showMenu />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {/* Upload Zone */}
        {!extracting && medicines.length === 0 && (
          <Card className="p-8">
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input {...getInputProps()} />
              {uploadedFile ? (
                <div className="space-y-2">
                  <Check className="w-12 h-12 text-success mx-auto" />
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">Ready to extract</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="font-medium">Drag prescription here or click to upload</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG, PDF up to 10MB</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Extraction Progress */}
        {extracting && (
          <Card className="p-8">
            <div className="space-y-6">
              <h3 className="font-semibold text-center">Processing Prescription...</h3>
              <div className="space-y-3">
                {stages.map((stage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      extractionStage > index
                        ? 'bg-success/10 text-success'
                        : extractionStage === index
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <span className="text-xl">{stage.icon}</span>
                    <span className="text-sm font-medium">{stage.label}</span>
                    {extractionStage > index && <Check className="w-4 h-4 ml-auto" />}
                    {extractionStage === index && (
                      <Loader2 className="w-4 h-4 ml-auto animate-spin" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Extracted Medicines */}
        {medicines.length > 0 && !extracting && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Extracted Medicines</h3>
              <Button
                onClick={() => {
                  setMedicines([]);
                  setUploadedFile(null);
                }}
                variant="outline"
                size="sm"
                className="rounded-lg"
              >
                Upload Another
              </Button>
            </div>

            {medicines.some((m) => m.confidence < 75) && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-sm text-warning">
                ⚠️ Please review highlighted medicines with low confidence
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">Medicine</th>
                    <th className="text-left p-3 font-medium">Dosage</th>
                    <th className="text-left p-3 font-medium">Frequency</th>
                    <th className="text-left p-3 font-medium">Duration</th>
                    <th className="text-left p-3 font-medium">Confidence</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine, index) => (
                    <tr
                      key={index}
                      className={`border-b border-border ${
                        medicine.confidence < 75 ? 'bg-warning/5' : ''
                      }`}
                    >
                      <td className="p-3">{medicine.name}</td>
                      <td className="p-3">{medicine.dosage}</td>
                      <td className="p-3">{medicine.frequency}</td>
                      <td className="p-3">{medicine.duration}</td>
                      <td className="p-3">
                        <Badge className={getConfidenceColor(medicine.confidence)}>
                          {getConfidenceLabel(medicine.confidence)} ({medicine.confidence}%)
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingIndex(index)}
                          className="rounded-lg"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => toast.success('Prescription confirmed!')}
                className="flex-1 rounded-lg gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm Prescription
              </Button>
              <Button
                onClick={() => {
                  setMedicines([]);
                  setUploadedFile(null);
                }}
                variant="outline"
                className="flex-1 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Prescription History */}
        <div className="space-y-4">
          <h3 className="font-semibold">Prescription History</h3>
          <div className="grid gap-4">
            {mockPrescriptions.map((rx) => (
              <Card key={rx.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{rx.date}</p>
                      <p className="text-sm text-muted-foreground">{rx.medicineCount} medicines</p>
                      <Badge variant="secondary" className="mt-2">
                        {rx.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
