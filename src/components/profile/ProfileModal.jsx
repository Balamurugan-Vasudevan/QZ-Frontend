import { useState, useEffect } from 'react'
import { useAuth }             from '../../context/AuthContext'
import {
  getProfile, updateProfile,
  updatePassword, deleteAccount
} from '../../api/profileService'
import {
  X, User, Mail, Lock,
  Save, Trash2, Eye,
  EyeOff, ShieldCheck
} from 'lucide-react'

function ProfileModal({ onClose }) {
  const { user, logout, login } = useAuth()

  const [tab, setTab]         = useState('profile')  // profile | password | danger
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')

  // profile fields
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')

  // password fields
  const [currentPwd, setCurrentPwd]   = useState('')
  const [newPwd, setNewPwd]           = useState('')
  const [confirmPwd, setConfirmPwd]   = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await getProfile()
      setName(data.name)
      setEmail(data.email)
    } catch {
      setError('Failed to load profile.')
    }
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const updated = await updateProfile({ name, email })
      // update localStorage
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem('user', JSON.stringify({ ...stored, ...updated }))
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    setError('')
    setSuccess('')
    if (newPwd !== confirmPwd) {
      setError('New passwords do not match.')
      return
    }
    if (newPwd.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await updatePassword({
        current_password: currentPwd,
        new_password:     newPwd,
      })
      setSuccess('Password updated successfully!')
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) {
      setError('Please type your email correctly to confirm.')
      return
    }
    setLoading(true)
    try {
      await deleteAccount()
      logout()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete account.')
      setLoading(false)
    }
  }

  const roleColor = user?.role === 'admin' ? '#2ec866' : '#f6ad55'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="profile-modal-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h3>{user?.name}</h3>
            <span className="profile-role" style={{ color: roleColor }}>
              {user?.role === 'admin' ? 'Teacher' : 'Student'}
            </span>
          </div>
          <button className="btn-remove" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          {[
            { key: 'profile',  label: 'Profile',  icon: <User      size={13} /> },
            { key: 'password', label: 'Password', icon: <Lock      size={13} /> },
            { key: 'danger',   label: 'Account',  icon: <ShieldCheck size={13} /> },
          ].map((t) => (
            <button key={t.key}
              className={`profile-tab ${tab === t.key ? 'active' : ''} ${t.key === 'danger' ? 'danger' : ''}`}
              onClick={() => { setTab(t.key); setError(''); setSuccess('') }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="profile-modal-body">

          {/* Success / Error */}
          {success && <p className="success-msg">{success}</p>}
          {error   && <p className="api-error">{error}</p>}

          {/* Profile Tab */}
          {tab === 'profile' && (
            <div className="profile-form">
              <div className="field">
                <label>Full Name</label>
                <div className="input-icon-wrapper">
                  <User size={14} className="input-icon" />
                  <input type="text" value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name" />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <div className="input-icon-wrapper">
                  <Mail size={14} className="input-icon" />
                  <input type="text" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email" />
                </div>
              </div>
              <div className="field">
                <label>Role</label>
                <input
                  type="text"
                  value={user?.role === 'admin' ? 'Teacher' : 'Student'}
                  disabled
                  style={{ background: '#f5f5f5', color: '#888', cursor: 'not-allowed' }}
                />
              </div>
              <button className="btn-green full-width"
                onClick={handleUpdateProfile} disabled={loading}>
                <Save size={13} style={{ marginRight: 6 }} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Password Tab */}
          {tab === 'password' && (
            <div className="profile-form">
              <div className="field">
                <label>Current Password</label>
                <div className="input-icon-wrapper">
                  <Lock size={14} className="input-icon" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button className="pwd-toggle"
                    onClick={() => setShowCurrent((p) => !p)}>
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="field">
                <label>New Password</label>
                <div className="input-icon-wrapper">
                  <Lock size={14} className="input-icon" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="Min. 6 characters"
                  />
                  <button className="pwd-toggle"
                    onClick={() => setShowNew((p) => !p)}>
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Confirm New Password</label>
                <div className="input-icon-wrapper">
                  <Lock size={14} className="input-icon" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Repeat new password"
                  />
                  <button className="pwd-toggle"
                    onClick={() => setShowConfirm((p) => !p)}>
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button className="btn-green full-width"
                onClick={handleUpdatePassword} disabled={loading}>
                <Lock size={13} style={{ marginRight: 6 }} />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}

          {/* Danger Tab */}
          {tab === 'danger' && (
            <div className="profile-form">
              <div className="danger-zone">
                <h4>Delete Account</h4>
                <p>
                  This action is <strong>permanent</strong> and cannot be undone.
                  All your data including attempts will be deleted.
                </p>
                <div className="field">
                  <label>Type your email to confirm</label>
                  <input type="text" placeholder={user?.email}
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)} />
                </div>
                <button className="btn-danger full-width"
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirm !== user?.email}>
                  <Trash2 size={13} style={{ marginRight: 6 }} />
                  {loading ? 'Deleting...' : 'Delete My Account'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProfileModal