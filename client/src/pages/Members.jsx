import { useState, useEffect } from 'react';
import styles from './Members.module.css';
import { MemberCard } from '../components/MemberCard';
import { MemberForm } from '../components/MemberForm';
import { Modal } from '../components/Modal';
import { RenewalModal } from '../components/RenewalModal';
import { ToastContainer } from '../components/Toast';
import { clientsAPI, exportAPI, notificationsAPI } from '../api/api';
import { useToast } from '../hooks/useToast';
import { useSocket, useSocketEvents } from '../hooks/useSocket';

export function Members() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [renewingMember, setRenewingMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const { socket } = useSocket();

  const getWhatsAppUrl = (member, type = 'welcome', endDate = member?.subscription_end) => {
    const digits = (member?.phone || '').replace(/\D/g, '');
    if (!digits) return '';

    let phone = digits;
    while (phone.startsWith('0')) phone = phone.slice(1);
    if (phone.length === 10) phone = `91${phone}`;

    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString()
      : '';
    const message = type === 'renewal'
      ? `Hello ${member.name}, your gym membership has been renewed successfully. Plan: ${member.subscription_type}. New end date: ${formattedEndDate}.`
      : `Hello ${member.name}, welcome to our gym. Your ${member.subscription_type} membership is active. End date: ${formattedEndDate}.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleWhatsApp = (member, type = 'welcome', endDate) => {
    const url = getWhatsAppUrl(member, type, endDate);
    if (!url) {
      showToast('Phone number is required for WhatsApp', 'error');
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, filterStatus]);

  const fetchMembers = async () => {
    try {
      const response = await clientsAPI.getAll();
      setMembers(response.data);
    } catch (error) {
      showToast('Failed to load members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(m => m.status === filterStatus);
    }

    setFilteredMembers(filtered);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleCloseMemberForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingMember) {
        await clientsAPI.update(editingMember.id, formData);
        showToast('Member updated successfully', 'success');
      } else {
        const response = await clientsAPI.create(formData);
        showToast('Member added successfully', 'success');
        handleWhatsApp(response.data, 'welcome');
      }
      handleCloseMemberForm();
      fetchMembers();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save member', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await clientsAPI.delete(deletingMember.id);
      showToast('Member deleted successfully', 'success');
      setDeletingMember(null);
      fetchMembers();
    } catch (error) {
      showToast('Failed to delete member', 'error');
    }
  };

  const handleResend = async (member, type = 'both') => {
    try {
      const resp = await notificationsAPI.resend(member.id, type);
      const results = resp.data.results || [];
      const ok = results.every(r => r.success);
      showToast(ok ? 'Notifications resent' : 'Resend attempted (see logs)', ok ? 'success' : 'warning');
      fetchMembers();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to resend notifications', 'error');
    }
  };

  const handleRenew = (member) => {
    setRenewingMember(member);
  };

  const handleRenewalConfirm = async (renewalData) => {
    try {
      await clientsAPI.renew(renewingMember.id, renewalData);
      showToast(`Membership renewed successfully for ${renewingMember.name}`, 'success');
      handleWhatsApp(
        { ...renewingMember, subscription_end: renewalData.new_end_date },
        'renewal',
        renewalData.new_end_date
      );
      setRenewingMember(null);
      fetchMembers();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to renew membership', 'error');
    }
  };

   const handleExportCSV = async () => {
     try {
       const response = await exportAPI.exportCSV();
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', `fitdesk_members_${new Date().toISOString().split('T')[0]}.csv`);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       showToast('CSV exported successfully', 'success');
     } catch (error) {
       showToast('Failed to export CSV', 'error');
     }
   };

  const handleQuickPayment = async (member) => {
    const due = Number(member.amount_due || 0);
    if (due <= 0) {
      showToast('No pending amount for this member', 'success');
      return;
    }

    try {
      await clientsAPI.recordPayment(member.id, {
        amount: due,
        payment_mode: member.payment_mode || 'Cash',
        payment_date: new Date().toISOString().split('T')[0],
        note: 'Due payment cleared'
      });
      showToast(`Payment recorded for ${member.name}`, 'success');
      fetchMembers();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to record payment', 'error');
    }
  };

  useSocketEvents(socket, {
    'client:created': (newMember) => {
      setMembers(prev => [newMember, ...prev]);
    },
    'client:updated': (updatedMember) => {
      setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    },
    'client:deleted': (deletedMember) => {
      setMembers(prev => prev.filter(m => m.id !== deletedMember.id));
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Members</h1>
            <p>Manage gym members and subscriptions</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.exportBtn} onClick={handleExportCSV}>
              📥 Export CSV
            </button>
            <button className={styles.addBtn} onClick={handleAddNew}>
              + Add Member
            </button>
          </div>
        </div>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <div className={styles.filterTabs}>
            {['all', 'active', 'expiring', 'expired'].map(status => (
              <button
                key={status}
                className={`${styles.filterTab} ${filterStatus === status ? styles.active : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className={styles.empty}>
            <p>No members found</p>
            <button className={styles.addBtn} onClick={handleAddNew}>
              Add your first member
            </button>
          </div>
        ) : (
           <div className={styles.grid}>
               {filteredMembers.map(member => (
                 <MemberCard
                   key={member.id}
                   member={member}
                   onEdit={handleEditMember}
                   onDelete={setDeletingMember}
                   onResend={handleResend}
                   onRenew={handleRenew}
                   onWhatsApp={handleWhatsApp}
                   onQuickPayment={handleQuickPayment}
                 />
               ))}
           </div>
        )}
      </div>

      {/* Member Form Modal */}
      {showForm && (
        <div className={styles.formBackdrop} onClick={handleCloseMemberForm}>
          <div className={styles.formModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
              <button className={styles.closeBtn} onClick={handleCloseMemberForm}>×</button>
            </div>
            <div className={styles.formBody}>
              <MemberForm
                member={editingMember}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseMemberForm}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingMember}
        title="Delete Member"
        confirmText="Delete"
        isDangerous={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingMember(null)}
      >
        <p>Are you sure you want to delete <strong>{deletingMember?.name}</strong>? This action cannot be undone.</p>
      </Modal>

      {/* Renewal Modal */}
      <RenewalModal
        isOpen={!!renewingMember}
        member={renewingMember}
        onConfirm={handleRenewalConfirm}
        onCancel={() => setRenewingMember(null)}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
