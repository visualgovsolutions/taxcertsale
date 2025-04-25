import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Label, Select, TextInput, Checkbox, ToggleSwitch } from 'flowbite-react';
import { HiOutlineClock, HiOutlineCalendar, HiPlus, HiPencil, HiTrash, HiDownload, HiOutlinePause, HiOutlinePlay } from 'react-icons/hi';
import { 
  ScheduledExportJob,
  EntityType,
  ExportFormat,
  FrequencyType
} from '../../../services/importExportService';
// Comment out TagInput for now as it seems to be missing
// import { TagInput } from '../../common/TagInput'; 
import { format, parseISO } from 'date-fns';

// Helper type for the form state
type ScheduledExportJobFormState = Partial<Omit<ScheduledExportJob, 'schedule'> & {
  schedule: Partial<ScheduledExportJob['schedule']>;
}>;

const ScheduledExportJobsPanel: React.FC = () => {
  const [jobs, setJobs] = useState<ScheduledExportJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<ScheduledExportJobFormState>({
    name: '',
    entityType: 'certificate',
    format: 'csv',
    schedule: {
      frequency: 'weekly',
      dayOfWeek: 1,
      hour: 3,
      minute: 0
    },
    fields: [],
    active: true
  });
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loadingJob, setLoadingJob] = useState<string | null>(null);

  // Load scheduled jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  // Format date using date-fns
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy, h:mm a');
    } catch (error) {
      console.error("Error parsing date:", dateString, error);
      return 'Invalid Date';
    }
  };

  // Fetch jobs from API
  const fetchJobs = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Replace with actual service call
      const fetchedJobs: ScheduledExportJob[] = [];
      // Example: const fetchedJobs = await getScheduledExports();
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setApiError('Failed to load scheduled jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get human-readable schedule description
  const getScheduleDescription = (job: ScheduledExportJob): string => {
    const schedule = job.schedule;
    if (!schedule) return 'Schedule not set';
    
    const timeFormatted = formatTime(schedule.hour, schedule.minute);
    
    switch (schedule.frequency) {
      case 'daily':
        return `Every day at ${timeFormatted}`;
      case 'weekly':
        return `Every ${getDayName(schedule.dayOfWeek ?? 0)} at ${timeFormatted}`;
      case 'monthly':
        return `On day ${schedule.dayOfMonth ?? 1} of each month at ${timeFormatted}`;
      default:
        return 'Schedule not properly configured';
    }
  };

  // Format time from hour and minute
  const formatTime = (hour?: number, minute?: number): string => {
    if (hour === undefined || minute === undefined) return 'Invalid Time';
    
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };

  // Get day name
  const getDayName = (day: number): string => {
    if (day < 0 || day > 6) return 'Invalid Day';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  // Add or update a job
  const saveJob = async (): Promise<void> => {
    if (!currentJob.name) {
      setApiError('Job name is required');
      return;
    }
    
    if (currentJob.schedule?.frequency === 'weekly' && 
        (currentJob.schedule.dayOfWeek === undefined || 
         currentJob.schedule.dayOfWeek < 0 || 
         currentJob.schedule.dayOfWeek > 6)) {
      setApiError('Valid day of week is required for weekly schedule');
      return;
    }
    
    if (currentJob.schedule?.frequency === 'monthly' && 
        (currentJob.schedule.dayOfMonth === undefined || 
         currentJob.schedule.dayOfMonth < 1 || 
         currentJob.schedule.dayOfMonth > 31)) {
      setApiError('Valid day of month (1-31) is required for monthly schedule');
      return;
    }

    setApiError(null);
    setSuccessMessage(null);

    try {
      if (isEditMode && currentJob.id) {
        // Example: await updateScheduledExport(currentJob.id, currentJob as unknown as ScheduledExportJob);
        setSuccessMessage(`Job "${currentJob.name}" updated successfully`);
      } else {
        // Example: await createScheduledExport(currentJob as unknown as Omit<ScheduledExportJob, 'id' | 'lastRun' | 'nextRun' | 'createdAt' | 'updatedAt'>);
        setSuccessMessage(`Job "${currentJob.name}" created successfully`);
      }
      await fetchJobs();
      closeModal();
    } catch (error: any) {
      console.error('Error saving job:', error);
      setApiError(`Failed to ${isEditMode ? 'update' : 'create'} job: ${error?.message || 'Please try again.'}`);
    }
  };

  // Toggle job active status
  const toggleJobStatus = async (jobId: string, active: boolean): Promise<void> => {
    setLoadingJob(jobId);
    setApiError(null);
    try {
      // Example: const updatedJob = await toggleScheduledJobStatus(jobId, !active);
      // Update the jobs state with the updated job
      setJobs(jobs.map(job => (job.id === jobId ? {...job, active: !active} : job)));
      setSuccessMessage(`Job ${active ? 'paused' : 'activated'} successfully`);
    } catch (error: any) {
      console.error('Error toggling job status:', error);
      setApiError(`Failed to update job status: ${error?.message || 'Please try again.'}`);
    } finally {
      setLoadingJob(null);
    }
  };

  // Delete a job
  const deleteJob = async (jobId: string): Promise<void> => {
    setLoadingJob(jobId);
    setApiError(null);
    try {
      // Example: await deleteScheduledExport(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
      setDeleteConfirmationId(null);
      setSuccessMessage('Job deleted successfully');
    } catch (error: any) {
      console.error('Error deleting job:', error);
      setApiError(`Failed to delete job: ${error?.message || 'Please try again.'}`);
    } finally {
      setLoadingJob(null);
    }
  };

  // Edit a job
  const editJob = (job: ScheduledExportJob): void => {
    setCurrentJob({ ...job, schedule: { ...job.schedule } });
    setIsEditMode(true);
    setShowJobModal(true);
  };

  // Create a new job
  const createNewJob = (): void => {
    setCurrentJob({
      name: '',
      entityType: 'certificate',
      format: 'csv',
      schedule: {
        frequency: 'weekly',
        dayOfWeek: 1,
        hour: 3,
        minute: 0
      },
      fields: [],
      active: true
    });
    setIsEditMode(false);
    setShowJobModal(true);
  };

  // Close modal and reset form
  const closeModal = (): void => {
    setShowJobModal(false);
    setApiError(null);
    // We keep success message visible after close
    
    // Reset form after animation completes
    setTimeout(() => {
      if (!showJobModal) {
        setCurrentJob({
          name: '',
          entityType: 'certificate',
          format: 'csv',
          schedule: {
            frequency: 'weekly',
            dayOfWeek: 1,
            hour: 3,
            minute: 0
          },
          fields: [],
          active: true
        });
      }
    }, 300);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    // Handle nested properties with dot notation
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCurrentJob({
        ...currentJob,
        [parent]: {
          ...currentJob[parent as keyof typeof currentJob] as object,
          [child]: value
        }
      });
    } else {
      setCurrentJob({
        ...currentJob,
        [name]: value
      });
    }
  };

  // Handle toggle change
  const handleToggleChange = (checked: boolean): void => {
    setCurrentJob({
      ...currentJob,
      active: checked
    });
  };

  // Handle schedule changes
  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    // Convert numeric values
    let processedValue: any = value;
    if (name === 'dayOfWeek' || name === 'dayOfMonth' || name === 'hour' || name === 'minute') {
      processedValue = parseInt(value, 10);
    }
    
    setCurrentJob({
      ...currentJob,
      schedule: {
        ...currentJob.schedule,
        [name]: processedValue
      }
    });
    
    // Reset related fields when frequency changes
    if (name === 'frequency') {
      const frequency = value as FrequencyType;
      const updatedSchedule = { ...currentJob.schedule, frequency };
      
      if (frequency === 'daily') {
        delete updatedSchedule.dayOfWeek;
        delete updatedSchedule.dayOfMonth;
      } else if (frequency === 'weekly') {
        updatedSchedule.dayOfWeek = 1; // Monday default
        delete updatedSchedule.dayOfMonth;
      } else if (frequency === 'monthly') {
        delete updatedSchedule.dayOfWeek;
        updatedSchedule.dayOfMonth = 1; // 1st day default
      }
      
      setCurrentJob({
        ...currentJob,
        schedule: updatedSchedule
      });
    }
  };

  // Add email recipient
  const addRecipient = (): void => {
    // Email validation
    if (!recipientEmail) {
      setEmailError('Email is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Check for duplicates
    const recipients = currentJob.emailRecipients || [];
    if (recipients.includes(recipientEmail)) {
      setEmailError('This email is already added');
      return;
    }
    
    // Add email to recipients list
    setCurrentJob({
      ...currentJob,
      emailRecipients: [...recipients, recipientEmail]
    });
    
    // Reset input and error
    setRecipientEmail('');
    setEmailError('');
  };

  // Remove email recipient
  const removeRecipient = (email: string): void => {
    const recipients = currentJob.emailRecipients || [];
    setCurrentJob({
      ...currentJob,
      emailRecipients: recipients.filter(e => e !== email)
    });
  };

  // Run job immediately
  const runJobNow = async (jobId: string): Promise<void> => {
    setLoadingJob(jobId);
    setApiError(null);
    
    try {
      // Example: const result = await runScheduledExport(jobId);
      setSuccessMessage('Job started successfully. Check export history for results.');
    } catch (error: any) {
      console.error('Error running job:', error);
      setApiError(`Failed to run job: ${error?.message || 'Please try again.'}`);
    } finally {
      setLoadingJob(null);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Scheduled Export Jobs</h3>
        <Button color="blue" size="sm" onClick={createNewJob}>
          <HiPlus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {successMessage}
        </div>
      )}

      {apiError && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {apiError}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading scheduled export jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No scheduled export jobs found.</p>
          <p className="mt-2">
            <Button color="light" size="sm" onClick={createNewJob}>
              Create your first scheduled export
            </Button>
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Entity Type</Table.HeadCell>
              <Table.HeadCell>Schedule</Table.HeadCell>
              <Table.HeadCell>Format</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Last Run</Table.HeadCell>
              <Table.HeadCell>Next Run</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {jobs.map(job => (
                <Table.Row key={job.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {job.name}
                  </Table.Cell>
                  <Table.Cell>
                    {job.entityType.charAt(0).toUpperCase() + job.entityType.slice(1)}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <HiOutlineCalendar className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{getScheduleDescription(job)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="uppercase">{job.format}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.active ? 'Active' : 'Paused'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <HiOutlineClock className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{formatDate(job.lastRun)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center">
                      <HiOutlineClock className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{formatDate(job.nextRun)}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button 
                        color="light" 
                        size="xs" 
                        onClick={() => runJobNow(job.id)}
                        disabled={loadingJob === job.id}
                      >
                        <HiDownload className="h-4 w-4" />
                      </Button>
                      <Button 
                        color="light" 
                        size="xs" 
                        onClick={() => toggleJobStatus(job.id, job.active)}
                        disabled={loadingJob === job.id}
                      >
                        {job.active ? 
                          <HiOutlinePause className="h-4 w-4" /> : 
                          <HiOutlinePlay className="h-4 w-4" />
                        }
                      </Button>
                      <Button 
                        color="light" 
                        size="xs" 
                        onClick={() => editJob(job)}
                      >
                        <HiPencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        color="failure" 
                        size="xs" 
                        onClick={() => setDeleteConfirmationId(job.id)}
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {/* Modal for creating/editing scheduled jobs */}
      <Modal 
        show={showJobModal} 
        onClose={closeModal}
        size="xl"
      >
        <Modal.Header>
          {isEditMode ? 'Edit Scheduled Export Job' : 'Create Scheduled Export Job'}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {apiError && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                {apiError}
              </div>
            )}
            
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Job Name" />
              </div>
              <TextInput
                id="name"
                name="name"
                value={currentJob.name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Weekly Certificate Export"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="entityType" value="Entity Type" />
                </div>
                <Select
                  id="entityType"
                  name="entityType"
                  value={currentJob.entityType || 'certificate'}
                  onChange={handleInputChange}
                  required
                >
                  <option value="certificate">Certificates</option>
                  <option value="property">Properties</option>
                  <option value="county">Counties</option>
                  <option value="auction">Auctions</option>
                  <option value="user">Users</option>
                  <option value="bid">Bids</option>
                  <option value="transaction">Transactions</option>
                </Select>
              </div>
              
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="format" value="Export Format" />
                </div>
                <Select
                  id="format"
                  name="format"
                  value={currentJob.format || 'csv'}
                  onChange={handleInputChange}
                  required
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="json">JSON</option>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="mb-2 block">
                <Label value="Schedule" />
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="schedule.frequency" value="Frequency" />
                    </div>
                    <Select
                      id="schedule.frequency"
                      name="frequency"
                      value={currentJob.schedule?.frequency || 'weekly'}
                      onChange={handleScheduleChange}
                      required
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </div>
                  
                  {currentJob.schedule?.frequency === 'weekly' && (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="schedule.dayOfWeek" value="Day of Week" />
                      </div>
                      <Select
                        id="schedule.dayOfWeek"
                        name="dayOfWeek"
                        value={currentJob.schedule?.dayOfWeek?.toString() || '1'}
                        onChange={handleScheduleChange}
                        required
                      >
                        <option value="0">Sunday</option>
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                      </Select>
                    </div>
                  )}
                  
                  {currentJob.schedule?.frequency === 'monthly' && (
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="schedule.dayOfMonth" value="Day of Month" />
                      </div>
                      <Select
                        id="schedule.dayOfMonth"
                        name="dayOfMonth"
                        value={currentJob.schedule?.dayOfMonth?.toString() || '1'}
                        onChange={handleScheduleChange}
                        required
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <option key={day} value={day.toString()}>{day}</option>
                        ))}
                      </Select>
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="schedule.hour" value="Hour" />
                    </div>
                    <Select
                      id="schedule.hour"
                      name="hour"
                      value={currentJob.schedule?.hour?.toString() || '0'}
                      onChange={handleScheduleChange}
                      required
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                        <option key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}:00 {hour >= 12 ? 'PM' : 'AM'}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <div className="mb-2 block">
                      <Label htmlFor="schedule.minute" value="Minute" />
                    </div>
                    <Select
                      id="schedule.minute"
                      name="minute"
                      value={currentJob.schedule?.minute?.toString() || '0'}
                      onChange={handleScheduleChange}
                      required
                    >
                      {[0, 15, 30, 45].map(minute => (
                        <option key={minute} value={minute.toString()}>
                          :{minute.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label value="Email Recipients (Optional)" />
                <span className="text-xs text-gray-500">
                  {currentJob.emailRecipients?.length || 0} recipient(s)
                </span>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="mb-4">
                  <div className="flex">
                    <TextInput
                      id="recipientEmail"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1"
                    />
                    <Button 
                      color="light" 
                      onClick={addRecipient}
                      className="ml-2"
                    >
                      Add
                    </Button>
                  </div>
                  {emailError && (
                    <div className="mt-1 text-sm text-red-600">
                      {emailError}
                    </div>
                  )}
                </div>
                
                {(currentJob.emailRecipients && currentJob.emailRecipients.length > 0) ? (
                  <div className="space-y-2">
                    {currentJob.emailRecipients.map((email, index) => (
                      <div key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                        <span>{email}</span>
                        <Button
                          color="light"
                          size="xs"
                          onClick={() => removeRecipient(email)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-2">
                    No recipients added yet
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <ToggleSwitch
                checked={currentJob.active ?? true}
                onChange={handleToggleChange}
                label="Active"
              />
              <span className="ml-2 text-sm text-gray-500">
                {currentJob.active ? 'Job will run on schedule' : 'Job is paused'}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={saveJob}>
            {isEditMode ? 'Update Job' : 'Create Job'}
          </Button>
          <Button color="gray" onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal 
        show={deleteConfirmationId !== null} 
        onClose={() => setDeleteConfirmationId(null)}
        size="md"
      >
        <Modal.Header>
          Confirm Delete
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this scheduled export job?</p>
          <p className="mt-2 text-gray-500">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            color="failure" 
            onClick={() => deleteConfirmationId && deleteJob(deleteConfirmationId)}
            disabled={loadingJob === deleteConfirmationId}
          >
            Yes, Delete Job
          </Button>
          <Button 
            color="gray" 
            onClick={() => setDeleteConfirmationId(null)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ScheduledExportJobsPanel; 