import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, Trash2, Plus, LogOut, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';

interface Address {
  id: string;
  label: string;
  address: string;
  pincode: string;
  isDefault: boolean;
}

export default function PatientProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.user_metadata?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState<string[]>(['Penicillin']);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      address: '123 Main St, Bangalore',
      pincode: '560001',
      isDefault: true,
    },
  ]);
  const [newAllergy, setNewAllergy] = useState('');

  const handleSaveProfile = async () => {
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    toast.success('Address deleted');
  };

  const userInitials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div>
      <AppHeader title="Profile" showMenu />
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 pb-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <p className="text-muted-foreground">{phone}</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setEditing(!editing)}
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-1"
                >
                  {editing ? (
                    <>
                      <X className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </Button>
              </motion.div>
            </div>

            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-border"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full rounded-lg gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Health Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold">Health Information</h3>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:outline-none"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Allergies</label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {allergies.map((allergy, idx) => (
                  <motion.div
                    key={allergy}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                      onClick={() => handleRemoveAllergy(allergy)}
                    >
                      {allergy}
                      <X className="w-3 h-3" />
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add allergy..."
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                  className="rounded-lg"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleAddAllergy}
                    variant="outline"
                    size="sm"
                    className="rounded-lg gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Saved Addresses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Saved Addresses</h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="rounded-lg gap-1">
                  <Plus className="w-4 h-4" />
                  Add New
                </Button>
              </motion.div>
            </div>

            <div className="space-y-3">
              {addresses.map((addr, idx) => (
                <motion.div
                  key={addr.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-border rounded-lg p-4 flex items-start justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{addr.label}</p>
                      {addr.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{addr.address}</p>
                    <p className="text-sm text-muted-foreground">{addr.pincode}</p>
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handleDeleteAddress(addr.id)}
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 space-y-3 border-destructive/20 bg-destructive/5">
            <h3 className="font-semibold text-destructive">Account Actions</h3>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full rounded-lg gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full rounded-lg text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Deactivate Account
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
