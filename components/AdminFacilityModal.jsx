'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  ShieldCheck, 
  AlertCircle, 
  Lock, 
  Unlock,
  CheckCircle2
} from 'lucide-react';
import { FACILITY_CATEGORIES, adminSaveFacility, adminDeleteFacility } from '../lib/facilitiesService';

export default function AdminFacilityModal({
  isOpen,
  onClose,
  destination,
  onFacilitySaved
}) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasskey, setAdminPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [editingFacility, setEditingFacility] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Default empty form
  const emptyForm = {
    name: '',
    category: 'medical',
    categoryLabel: 'Hospital & Emergency Care',
    description: '',
    latitude: destination ? destination.lat : 20.0053,
    longitude: destination ? destination.lng : 73.7925,
    address: '',
    area: destination ? destination.area : 'Panchavati',
    contact_number: '',
    opening_hours: '',
    verification_status: 'verified',
    source: 'Official Municipal Verification Cell',
    is_active: true
  };

  const [formData, setFormData] = useState(emptyForm);

  if (!isOpen) return null;

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasskey === 'kumbh2027' || adminPasskey === 'admin' || adminPasskey === 'touristassist') {
      setIsAdminAuthenticated(true);
      setPasskeyError('');
    } else {
      setPasskeyError('Invalid admin authorization passkey. (Hint: kumbh2027)');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Please provide at least a facility name and address.');
      return;
    }

    if (isNaN(parseFloat(formData.latitude)) || isNaN(parseFloat(formData.longitude))) {
      alert('Please enter valid numeric latitude and longitude coordinates.');
      return;
    }

    setSaving(true);
    try {
      const saved = await adminSaveFacility(formData);
      setSaving(false);
      setSuccessMsg(`Facility "${saved.name}" successfully updated & saved!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      if (onFacilitySaved) onFacilitySaved();
      setFormData(emptyForm);
      setEditingFacility(null);
    } catch (err) {
      setSaving(false);
      alert('Error saving facility: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-white/20 p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-electric/20 border border-cyan-electric/40 text-cyan-electric flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading">
              Admin Facility Management
            </h3>
            <p className="text-xs text-slate-400">
              Verified municipal infrastructure registry for Tourist Assist
            </p>
          </div>
        </div>

        {/* Auth Gate */}
        {!isAdminAuthenticated ? (
          <form onSubmit={handleAdminLogin} className="space-y-4 py-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 text-xs text-slate-300 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Authorized Administrator Verification</strong>
                Enter your administrative security credentials to manage facility records, update verification statuses, or adjust coordinates.
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Admin Security Passkey:
              </label>
              <input
                type="password"
                placeholder="Enter passkey (hint: kumbh2027)..."
                value={adminPasskey}
                onChange={(e) => setAdminPasskey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-electric"
              />
              {passkeyError && (
                <span className="text-xs text-red-400 block mt-1">{passkeyError}</span>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-electric text-slate-950 font-bold text-xs hover:opacity-95 shadow-md shadow-cyan-electric/20"
              >
                Authenticate &amp; Unlock
              </button>
            </div>
          </form>
        ) : (
          /* Facility Form */
          <form onSubmit={handleSave} className="space-y-4">
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suyog Hospital"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const label = FACILITY_CATEGORIES[cat]?.name || cat;
                    setFormData({ ...formData, category: cat, categoryLabel: label });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                >
                  {Object.entries(FACILITY_CATEGORIES).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.iconText} {cfg.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verification Status */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Verification Status *
                </label>
                <select
                  value={formData.verification_status}
                  onChange={(e) => setFormData({ ...formData, verification_status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                >
                  <option value="verified">Verified Official Record</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="unverified">Unverified Community Lead</option>
                </select>
              </div>

              {/* Latitude */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              {/* Longitude */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Address &amp; Area *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street, area, postal code..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Verified Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 253 251 1234 or 108"
                  value={formData.contact_number || ''}
                  onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              {/* Operating Hours */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24/7 or 6:00 AM – 10:00 PM"
                  value={formData.opening_hours || ''}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              {/* Source */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Data Source &amp; Authority *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik Municipal Corporation / State Police Directory"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Facility Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief details about services provided..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-[11px] text-slate-400">
                Data will be persisted locally and synchronized with Supabase if online.
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-electric to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-electric/20 hover:scale-[1.01] transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save & Publish Facility'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

