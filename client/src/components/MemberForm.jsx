import { useState, useEffect } from 'react';
import styles from './MemberForm.module.css';

const PLAN_TYPES = [
  { value: 'Basic', label: 'Basic - ₹2,000/mo', price: 2000 },
  { value: 'Premium', label: 'Premium - ₹3,500/mo', price: 3500 },
  { value: 'VIP', label: 'VIP - ₹5,000/mo', price: 5000 },
  { value: 'Personal Training', label: 'Personal Training - ₹7,000/mo', price: 7000 }
];

export function MemberForm({ member, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subscription_start: new Date().toISOString().split('T')[0],
    subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subscription_type: 'Basic',
    amount_paid: 0,
    amount_due: 2000,
    payment_mode: 'Cash'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlanChange = (e) => {
    const selectedPlan = PLAN_TYPES.find(plan => plan.value === e.target.value);
    const price = selectedPlan?.price || 0;
    const paid = Number(formData.amount_paid || 0);

    setFormData(prev => ({
      ...prev,
      subscription_type: e.target.value,
      amount_due: Math.max(0, price - paid)
    }));
  };

  const handleAmountPaidChange = (e) => {
    const paid = Number(e.target.value || 0);
    const selectedPlan = PLAN_TYPES.find(plan => plan.value === formData.subscription_type);
    const price = selectedPlan?.price || 0;

    setFormData(prev => ({
      ...prev,
      amount_paid: e.target.value,
      amount_due: Math.max(0, price - paid)
    }));
  };

  const handleEndDateChange = () => {
    const start = new Date(formData.subscription_start);
    const end = new Date(start);
    end.setDate(end.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      subscription_end: end.toISOString().split('T')[0]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.subscription_start) newErrors.subscription_start = 'Start date is required';
    if (!formData.subscription_end) newErrors.subscription_end = 'End date is required';

    const start = new Date(formData.subscription_start);
    const end = new Date(formData.subscription_end);
    if (end <= start) newErrors.subscription_end = 'End date must be after start date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.group}>
        <label htmlFor="name">Full Name *</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Smith"
          className={errors.name ? styles.error : ''}
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={errors.email ? styles.error : ''}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.group}>
          <label htmlFor="phone">Phone *</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="555-0101"
            className={errors.phone ? styles.error : ''}
          />
          {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
        </div>
      </div>

      <div className={styles.group}>
        <label htmlFor="subscription_type">Plan *</label>
        <select
          id="subscription_type"
          name="subscription_type"
          value={formData.subscription_type}
          onChange={handlePlanChange}
        >
          {PLAN_TYPES.map(plan => (
            <option key={plan.value} value={plan.value}>{plan.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="amount_paid">Amount Paid</label>
          <input
            id="amount_paid"
            type="number"
            min="0"
            name="amount_paid"
            value={formData.amount_paid}
            onChange={handleAmountPaidChange}
            placeholder="0"
          />
        </div>

        <div className={styles.group}>
          <label htmlFor="amount_due">Amount Due</label>
          <input
            id="amount_due"
            type="number"
            min="0"
            name="amount_due"
            value={formData.amount_due}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      <div className={styles.group}>
        <label htmlFor="payment_mode">Payment Mode</label>
        <select
          id="payment_mode"
          name="payment_mode"
          value={formData.payment_mode}
          onChange={handleChange}
        >
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="subscription_start">Start Date *</label>
          <input
            id="subscription_start"
            type="date"
            name="subscription_start"
            value={formData.subscription_start}
            onChange={(e) => {
              handleChange(e);
              handleEndDateChange();
            }}
            className={errors.subscription_start ? styles.error : ''}
          />
          {errors.subscription_start && <span className={styles.errorText}>{errors.subscription_start}</span>}
        </div>

        <div className={styles.group}>
          <label htmlFor="subscription_end">End Date *</label>
          <input
            id="subscription_end"
            type="date"
            name="subscription_end"
            value={formData.subscription_end}
            onChange={handleChange}
            className={errors.subscription_end ? styles.error : ''}
          />
          {errors.subscription_end && <span className={styles.errorText}>{errors.subscription_end}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : member ? 'Update Member' : 'Add Member'}
        </button>
      </div>
    </form>
  );
}
