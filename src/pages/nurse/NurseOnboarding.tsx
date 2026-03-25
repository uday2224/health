import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Loader2, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';

type Step = 1 | 2 | 3 | 4 | 5;

const SPECIALIZATIONS = [
  'Wound Care',
  'IV Therapy',
  'Geriatric',
  'Post-Op',
  'Pediatric',
  'Physiotherapy',
  'ICU Care',
  'Palliative Care',
  'Diabetic Care',
  'Oncology Care',
  'Mental Health',
  'Mother-Baby',
];

export default function NurseOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 2
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // Step 3
  const [specializations, setSpecializations] = useState<string[]>([]);

  // Step 4
  const [idProofFile, setIdProofFile] = useState<File | null>(null);

  // Step 5
  const [experience, setExperience] = useState(5);
  const [bio, setBio] = useState('');

  const { getRootProps: getLicenseProps, getInputProps: getLicenseInput } = useDropzone({
    onDrop: (files) => setLicenseFile(files[0]),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'], 'application/pdf': ['.pdf'] },
  });

  const { getRootProps: getIdProps, getInputProps: getIdInput } = useDropzone({
    onDrop: (files) => setIdProofFile(files[0]),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
  });

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (step === 2 && (!licenseNumber.trim() || !licenseFile)) {
      toast.error('Please enter license number and upload document');
      return;
    }
    if (step === 3 && specializations.length === 0) {
      toast.error('Please select at least one specialization');
      return;
    }
    if (step === 4 && !idProofFile) {
      toast.error('Please upload ID proof');
      return;
    }
    if (step < 5) setStep((step + 1) as Step);
  };

  const handleSubmit = async () => {
    if (!bio.trim()) {
      toast.error('Please enter your bio');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw authError || new Error('No user found');

      // Upload license document
      let licenseUrl = null;
      if (licenseFile) {
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(`licenses/${user.id}/${Date.now()}`, licenseFile);
        if (error) throw error;
        licenseUrl = data.path;
      }

      // Upload ID proof
      let idProofUrl = null;
      if (idProofFile) {
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(`id-proofs/${user.id}/${Date.now()}`, idProofFile);
        if (error) throw error;
        idProofUrl = data.path;
      }

      // Create nurse profile
      const { error: profileError } = await supabase
        .from('nurse_profiles')
        .insert({
          user_id: user.id,
          license_number: licenseNumber,
          license_document_url: licenseUrl,
          id_proof_url: idProofUrl,
          specializations,
          years_of_experience: experience,
          bio,
          verification_status: 'PENDING_VERIFICATION',
          is_available: false,
          created_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast.success('Application submitted! We\'ll verify within 24 hours.');
      navigate('/nurse/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step {step} of 5</p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-card shadow-card p-6 md:p-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                <p className="text-muted-foreground">Confirm your details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-lg"
                    disabled
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">License Details</h2>
                <p className="text-muted-foreground">Government issued medical license</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">License Number</label>
                  <Input
                    placeholder="NR-12345678"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Upload License Document</label>
                  <div
                    {...getLicenseProps()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <input {...getLicenseInput()} />
                    {licenseFile ? (
                      <div className="flex items-center justify-center gap-2 text-success">
                        <Check className="w-5 h-5" />
                        <span>{licenseFile.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                        <p className="text-sm font-medium">Drag file here or click to upload</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Specializations</h2>
                <p className="text-muted-foreground">Select at least one specialization</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SPECIALIZATIONS.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      setSpecializations((prev) =>
                        prev.includes(spec)
                          ? prev.filter((s) => s !== spec)
                          : [...prev, spec]
                      );
                    }}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      specializations.includes(spec)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          specializations.includes(spec)
                            ? 'border-primary bg-primary'
                            : 'border-border'
                        }`}
                      >
                        {specializations.includes(spec) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{spec}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">ID Proof</h2>
                <p className="text-muted-foreground">Aadhar or PAN card</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Upload ID Proof</label>
                <div
                  {...getIdProps()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <input {...getIdInput()} />
                  {idProofFile ? (
                    <div className="flex items-center justify-center gap-2 text-success">
                      <Check className="w-5 h-5" />
                      <span>{idProofFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium">Drag file here or click to upload</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Experience & Bio</h2>
                <p className="text-muted-foreground">Tell us about yourself</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Years of Experience: {experience} years
                  </label>
                  <Slider
                    value={[experience]}
                    onValueChange={(val) => setExperience(val[0])}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bio ({bio.length}/200)
                  </label>
                  <Textarea
                    placeholder="What makes you a great nurse?"
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 200))}
                    className="rounded-lg min-h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                onClick={() => setStep((step - 1) as Step)}
                variant="outline"
                className="rounded-lg gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            {step < 5 ? (
              <Button
                onClick={handleNext}
                className="flex-1 rounded-lg gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Check className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
