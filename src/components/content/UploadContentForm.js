'use client';
import { useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { uploadContent } from '@/services/content.service';
import { SUBJECTS, ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_MB } from '@/lib/constants';
import { validateFile } from '@/lib/utils';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Upload, Image as ImageIcon, X, CheckCircle2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime } from '@/lib/utils';
import { BookOpen, Clock } from 'lucide-react';

const schema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title too long'),
    subject: z.string().min(1, 'Please select a subject'),
    description: z.string().max(500, 'Description too long').optional(),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    rotationDuration: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v) : 30))
      .refine((v) => !isNaN(v) && v >= 5 && v <= 300, 'Must be between 5–300 seconds'),
  })
  .refine((d) => new Date(d.endTime) > new Date(d.startTime), {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

export function UploadContentForm() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  const watchedValues = watch();

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { valid, error } = validateFile(file);
    if (!valid) {
      setFileError(error);
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }
    setFileError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleFileDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileChange({ target: { files: [file] } });
      }
    },
    [handleFileChange]
  );

  const onSubmit = useCallback(
    async (values) => {
      if (!selectedFile) {
        setFileError('Please upload a file.');
        return;
      }
      setUploadError('');
      try {
        const formData = new FormData();
        formData.append('teacherId', user.id);
        formData.append('teacherName', user.name);
        formData.append('title', values.title);
        formData.append('subject', values.subject);
        formData.append('description', values.description || '');
        formData.append('startTime', values.startTime);
        formData.append('endTime', values.endTime);
        formData.append('rotationDuration', String(values.rotationDuration));
        formData.append('file', selectedFile);

        await uploadContent(formData);
        setIsSuccess(true);
        toast.success('Content uploaded successfully!');
        reset();
        setSelectedFile(null);
        setFilePreview(null);
        setTimeout(() => router.push('/teacher/my-content'), 1500);
      } catch (err) {
        setUploadError(err.message || 'Upload failed. Please try again.');
        toast.error('Upload failed');
      }
    },
    [selectedFile, user, reset, router]
  );

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="py-16 flex flex-col items-center text-center">
          <div className="p-4 bg-emerald-500/20 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Uploaded Successfully!</h3>
          <p className="text-white/50 text-sm">Your content is pending approval. Redirecting...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: File upload */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Media File</CardTitle>
              <p className="text-sm text-white/40 mt-1">JPG, PNG, or GIF · Max {MAX_FILE_SIZE_MB}MB</p>
            </CardHeader>
            <CardContent>
              <div
                className="relative border-2 border-dashed border-white/20 rounded-xl transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/5 cursor-pointer group"
                style={{ minHeight: '280px' }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {filePreview ? (
                  <div className="relative h-full">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setFilePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="mt-3 text-center text-sm text-white/60 pb-2">
                      <p className="font-medium text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-4 bg-white/5 rounded-2xl mb-4 group-hover:bg-violet-500/10 transition-all">
                      <Upload className="h-8 w-8 text-white/30 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <p className="text-white/60 font-medium">Drop file here</p>
                    <p className="text-sm text-white/30 mt-1">or click to browse</p>
                    <p className="text-xs text-white/20 mt-3">
                      {ALLOWED_FILE_EXTENSIONS.join(', ')}
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileError && <p className="text-xs text-red-400 mt-2">{fileError}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Right: Metadata */}
        <div className="xl:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadError && <Alert variant="error">{uploadError}</Alert>}

              <Input
                label="Title"
                required
                placeholder="e.g. Introduction to Photosynthesis"
                error={errors.title?.message}
                {...register('title')}
              />

              <Select
                label="Subject"
                required
                placeholder="-- Select Subject --"
                error={errors.subject?.message}
                {...register('subject')}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>

              <Textarea
                label="Description"
                placeholder="Brief description of the content..."
                hint="Optional – max 500 characters"
                error={errors.description?.message}
                {...register('description')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="datetime-local"
                  label="Start Time"
                  required
                  error={errors.startTime?.message}
                  {...register('startTime')}
                />
                <Input
                  type="datetime-local"
                  label="End Time"
                  required
                  error={errors.endTime?.message}
                  {...register('endTime')}
                />
              </div>

              <Input
                type="number"
                label="Rotation Duration (seconds)"
                placeholder="30"
                hint="How long to display before rotating (5–300s)"
                min={5}
                max={300}
                error={errors.rotationDuration?.message}
                {...register('rotationDuration')}
              />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setIsPreviewOpen(true)}
              disabled={!watchedValues.title || !filePreview}
            >
              <Eye className="h-5 w-5" />
              Preview
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="flex-[2]"
            >
              <Upload className="h-5 w-5" />
              {isSubmitting ? 'Uploading...' : 'Upload Content'}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Live Broadcast Preview"
        size="lg"
      >
        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/10 max-w-md mx-auto">
          <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600" />
          <div className="relative h-64">
            {filePreview ? (
              <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <ImageIcon className="h-12 w-12 text-white/10" />
              </div>
            )}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3 text-left">
            <div>
              <h3 className="text-xl font-bold text-white">{watchedValues.title || 'Untitled Content'}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-violet-400 font-medium flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {watchedValues.subject || 'No Subject'}
                </span>
              </div>
            </div>
            {watchedValues.description && (
              <p className="text-sm text-white/50">{watchedValues.description}</p>
            )}
            <div className="flex items-center gap-2 text-[10px] text-white/30 bg-white/5 rounded-lg p-2">
              <Clock className="h-3 w-3" />
              <span>Ends: {watchedValues.endTime ? formatDateTime(watchedValues.endTime) : 'Not set'}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Button variant="primary" onClick={() => setIsPreviewOpen(false)}>
            Looks Good
          </Button>
        </div>
      </Modal>
    </form>
  );
}
