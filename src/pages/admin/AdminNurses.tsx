import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockNurses } from '@/lib/mock-data';
import { CheckCircle, XCircle, AlertCircle, Search, Eye, FileText } from 'lucide-react';

type VerificationStatus = 'pending' | 'active' | 'suspended';

export default function AdminNurses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<VerificationStatus>('pending');
  const [selectedNurse, setSelectedNurse] = useState<typeof mockNurses[0] | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyAction, setVerifyAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredNurses = mockNurses.filter((nurse) => {
    const matchesSearch =
      nurse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nurse.phone.includes(searchTerm) ||
      nurse.licenseNumber.includes(searchTerm);

    const matchesTab =
      selectedTab === 'pending' ? nurse.verificationStatus === 'pending' :
      selectedTab === 'active' ? nurse.verificationStatus === 'active' :
      nurse.verificationStatus === 'suspended';

    return matchesSearch && matchesTab;
  });

  const handleVerify = (nurse: typeof mockNurses[0], action: 'approve' | 'reject') => {
    setSelectedNurse(nurse);
    setVerifyAction(action);
    setShowVerifyModal(true);
  };

  const handleConfirmVerify = () => {
    if (selectedNurse) {
      console.log(`${verifyAction} nurse:`, selectedNurse.id, rejectReason);
      setShowVerifyModal(false);
      setRejectReason('');
      setVerifyAction(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'suspended':
        return <XCircle className="w-4 h-4 text-danger" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div>
      <AppHeader title="Nurse Management" showMenu />
      <div className="p-4 md:p-6 space-y-6 max-w-6xl">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or license..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as VerificationStatus)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({mockNurses.filter((n) => n.verificationStatus === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({mockNurses.filter((n) => n.verificationStatus === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="suspended">
              Suspended ({mockNurses.filter((n) => n.verificationStatus === 'suspended').length})
            </TabsTrigger>
          </TabsList>

          {['pending', 'active', 'suspended'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filteredNurses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No nurses found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNurses.map((nurse, i) => (
                    <motion.div
                      key={nurse.id}
                      className="bg-card rounded-card shadow-card p-4 border border-border hover:border-primary/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {nurse.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm">{nurse.name}</p>
                            <p className="text-xs text-muted-foreground">{nurse.phone}</p>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {nurse.specializations.slice(0, 2).map((spec) => (
                                <Badge key={spec} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                              {nurse.specializations.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{nurse.specializations.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusIcon(nurse.verificationStatus)}
                          {getStatusBadge(nurse.verificationStatus)}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedNurse(nurse);
                              setShowVerifyModal(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {nurse.verificationStatus === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-success hover:bg-success/90"
                                onClick={() => handleVerify(nurse, 'approve')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleVerify(nurse, 'reject')}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Verify Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {verifyAction === 'approve' ? 'Approve Nurse' : 'Reject Application'}
            </DialogTitle>
          </DialogHeader>

          {selectedNurse && (
            <div className="space-y-4">
              {/* Nurse Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold">{selectedNurse.name}</p>
                <p className="text-sm text-muted-foreground">{selectedNurse.phone}</p>
                <p className="text-sm text-muted-foreground">License: {selectedNurse.licenseNumber}</p>
              </div>

              {/* Documents */}
              <div className="space-y-2">
                <p className="font-semibold text-sm">Documents</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    License
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    ID Proof
                  </Button>
                </div>
              </div>

              {/* Reject Reason */}
              {verifyAction === 'reject' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Rejection</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full p-2 border border-border rounded-lg text-sm"
                    rows={3}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowVerifyModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmVerify}
                  className={verifyAction === 'approve' ? 'bg-success hover:bg-success/90' : 'bg-danger hover:bg-danger/90'}
                >
                  {verifyAction === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
