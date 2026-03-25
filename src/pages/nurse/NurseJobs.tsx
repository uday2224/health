import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Pill, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Job {
  id: string;
  date: string;
  time: string;
  area: string;
  serviceType: string;
  duration: string;
  pay: number;
  hasPrescription: boolean;
  patientInitials: string;
}

const mockJobs: Job[] = [
  {
    id: '1',
    date: '2026-03-24',
    time: '10:00 AM',
    area: 'Indiranagar',
    serviceType: 'Post-Op Care',
    duration: '2 hours',
    pay: 800,
    hasPrescription: true,
    patientInitials: 'RK',
  },
  {
    id: '2',
    date: '2026-03-24',
    time: '2:00 PM',
    area: 'Koramangala',
    serviceType: 'IV Therapy',
    duration: '1 hour',
    pay: 600,
    hasPrescription: false,
    patientInitials: 'SM',
  },
  {
    id: '3',
    date: '2026-03-25',
    time: '9:00 AM',
    area: 'Whitefield',
    serviceType: 'Wound Care',
    duration: '1.5 hours',
    pay: 700,
    hasPrescription: true,
    patientInitials: 'AJ',
  },
];

export default function NurseJobs() {
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleAcceptJob = async (jobId: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success('Job accepted! You can now navigate to the patient.');
      setShowDetailsModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept job');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    toast.info('Job rejected');
  };

  return (
    <div>
      <AppHeader title="Available Jobs" showMenu />
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No jobs available right now</p>
            <p className="text-sm text-muted-foreground mb-6">
              Make sure you're set to Online to receive new jobs
            </p>
            <Button className="rounded-lg">Go to Dashboard</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} available
            </p>

            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary text-sm">
                        {job.patientInitials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {job.serviceType}
                          </Badge>
                          {job.hasPrescription && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Pill className="w-3 h-3" />
                              Rx
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {job.date} at {job.time}
                          </p>
                          <p className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {job.area} • {job.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success">₹{job.pay}</p>
                      <p className="text-xs text-muted-foreground">estimated</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewDetails(job)}
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleAcceptJob(job.id)}
                      size="sm"
                      className="flex-1 rounded-lg gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Service Type</p>
                  <p className="font-medium">{selectedJob.serviceType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {selectedJob.date} at {selectedJob.time}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedJob.area}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedJob.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <p className="font-bold text-lg text-success">₹{selectedJob.pay}</p>
                </div>
              </div>

              {selectedJob.hasPrescription && (
                <div className="bg-info/10 border border-info/20 rounded-lg p-3 text-sm">
                  <p className="font-medium mb-1">💊 Prescription Attached</p>
                  <p className="text-xs text-muted-foreground">
                    Patient has uploaded a prescription. You can view it after accepting.
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleAcceptJob(selectedJob.id)}
                  disabled={loading}
                  className="flex-1 rounded-lg gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Accept Job
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    handleRejectJob(selectedJob.id);
                    setShowDetailsModal(false);
                  }}
                  variant="outline"
                  className="flex-1 rounded-lg gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
