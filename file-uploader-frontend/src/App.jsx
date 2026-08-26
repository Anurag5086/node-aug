import { useState, useRef, useCallback } from 'react'
import './App.css'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/file/upload'
const MAX_FILE_SIZE = 10 * 1024 * 1024

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function getFileIcon(type) {
  if (type.startsWith('image/')) return 'image'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  if (type.includes('pdf')) return 'pdf'
  return 'file'
}

function Toast({ toast, onClose }) {
  return (
    <div className={`toast ${toast.type}`}>
      <div className="toast-icon">
        {toast.type === 'success' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
      </div>
      <div className="toast-content">
        <h4>{toast.title}</h4>
        <p>{toast.message}</p>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

function FileTypeIcon({ type }) {
  const icon = getFileIcon(type)
  const paths = {
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    video: <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
    audio: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
    pdf: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[icon]}
    </svg>
  )
}

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [toast, setToast] = useState(null)
  const fileInputRef = useRef(null)

  const showToast = useCallback((type, title, message) => {
    setToast({ type, title, message })
    setTimeout(() => setToast(null), 5000)
  }, [])

  const validateFile = useCallback((f) => {
    if (f.size > MAX_FILE_SIZE) {
      showToast('error', 'File too large', `Maximum file size is ${formatBytes(MAX_FILE_SIZE)}.`)
      return false
    }
    return true
  }, [showToast])

  const setSelectedFile = useCallback((f) => {
    if (!f || !validateFile(f)) return
    setFile(f)
    if (f.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }, [validateFile])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) setSelectedFile(selected)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) setSelectedFile(dropped)
  }

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setFile(null)
    setPreview(null)
    setUploadResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      showToast('error', 'No file selected', 'Please choose a file to upload.')
      return
    }
    if (title.trim().length < 3) {
      showToast('error', 'Invalid title', 'Title must be at least 3 characters.')
      return
    }
    if (description.trim().length < 3) {
      showToast('error', 'Invalid description', 'Description must be at least 3 characters.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('description', description.trim())
      formData.append('file', file)

      const res = await axios.post(API_URL, formData)
      setUploadResult(res.data)
      showToast('success', 'Upload complete', res.data.message || 'Your file has been saved securely.')
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.details?.[0]?.message ||
        'Something went wrong. Please try again.'
      showToast('error', 'Upload failed', message)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = file && title.trim().length >= 3 && description.trim().length >= 3

  return (
    <div className="app">
      <div className="bg-mesh" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <header className="header container">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="logo-text">
            CloudVault <span>/ File Upload</span>
          </div>
        </div>
        <div className="header-badge">
          <span className="status-dot" />
          API Online
        </div>
      </header>

      <main className="main-content container">
        <section className="hero">
          <div className="hero-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Secure · Rate-limited · MongoDB-backed
          </div>
          <h1>Upload files with confidence</h1>
          <p>
            A production-ready file upload platform with validation, rate limiting,
            and persistent storage — built for real-world applications.
          </p>
          <div className="features-row">
            <div className="feature-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Helmet Security
            </div>
            <div className="feature-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Rate Limited
            </div>
            <div className="feature-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
              </svg>
              MongoDB Storage
            </div>
            <div className="feature-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Up to 10 MB
            </div>
          </div>
        </section>

        <section className="upload-card">
          {uploadResult?.success ? (
            <div className="success-panel">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2>Upload Successful!</h2>
              <p>Your file has been securely stored and indexed.</p>
              <dl className="success-details">
                <dt>Title</dt>
                <dd>{uploadResult.file?.title}</dd>
                <dt>Description</dt>
                <dd>{uploadResult.file?.description}</dd>
                <dt>File ID</dt>
                <dd>{uploadResult.file?._id}</dd>
              </dl>
              <button type="button" className="reset-btn" onClick={resetForm}>
                Upload another file
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                className={`dropzone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && !file && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  aria-label="Choose file to upload"
                />

                {file ? (
                  <div className="file-preview">
                    {preview ? (
                      <img src={preview} alt="" className="file-preview-thumb" />
                    ) : (
                      <div className="file-preview-icon">
                        <FileTypeIcon type={file.type} />
                      </div>
                    )}
                    <div className="file-preview-info">
                      <h4>{file.name}</h4>
                      <p>{formatBytes(file.size)} · {file.type || 'unknown type'}</p>
                    </div>
                    <button type="button" className="file-remove" onClick={removeFile} aria-label="Remove file">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="dropzone-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <h3>Drag & drop your file here</h3>
                    <p>or <strong>browse</strong> to choose from your device</p>
                    <p className="dropzone-hint">max 10 MB · images, videos, documents</p>
                  </>
                )}
              </div>

              <div className="form-divider">File details</div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="e.g. Project proposal Q3"
                    value={title}
                    maxLength={200}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <span className="char-count">{title.length}/200</span>
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of the file contents..."
                    value={description}
                    maxLength={500}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <span className="char-count">{description.length}/500</span>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading || !isFormValid}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload to CloudVault
                  </>
                )}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="footer container">
        <div className="footer-content">
          <div className="footer-tech">
            <span className="tech-badge">React 19</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Express</span>
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">Multer</span>
            <span className="tech-badge">Joi</span>
          </div>
          <p className="footer-credit">
            Built by <strong>Shivam</strong> — Full-stack file upload system
          </p>
          <div className="footer-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="toast-container">
          <Toast toast={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  )
}

export default App
