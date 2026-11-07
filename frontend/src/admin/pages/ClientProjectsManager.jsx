import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from 'sonner';
import {
  Plus, Edit, Trash2, Upload, Download, FileText, X, Target, ListChecks,
  Users, DollarSign, Activity, MessageCircle, Send, Calendar, CheckCircle2,
  User, Clock, Search, Filter, Download as DownloadIcon, BarChart3,
  RefreshCw, Copy, TrendingUp, AlertCircle
} from 'lucide-react';
import clientService from '../../services/clientService';

export default function ClientProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatEndRef = useRef(null);

  // Enhanced features state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [showStats, setShowStats] = useState(true);

  // Milestone/Task/Team/Budget Dialog States
  const [milestoneDialog, setMilestoneDialog] = useState({ open: false, data: null });
  const [taskDialog, setTaskDialog] = useState({ open: false, data: null });
  const [teamDialog, setTeamDialog] = useState({ open: false, data: null });
  const [budgetDialog, setBudgetDialog] = useState({ open: false, data: null });

  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    progress: 0,
    start_date: '',
    expected_delivery: '',
    notes: '',
    tags: []
  });

  // Utility function to extract error messages
  const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;

      // If detail is an array (validation errors)
      if (Array.isArray(detail)) {
        return detail.map(err => err.msg || err).join(', ');
      }
      // If detail is a string
      else if (typeof detail === 'string') {
        return detail;
      }
      // If detail is an object
      else if (typeof detail === 'object') {
        return detail.msg || JSON.stringify(detail);
      }
    }

    return defaultMessage;
  };

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedProject && activeTab === 'chat') {
      fetchChatMessages();
    }
  }, [selectedProject, activeTab]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchProjects = async () => {
    try {
      const data = await clientService.getAllClientProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchChatMessages = async () => {
    if (!selectedProject) return;

    try {
      const messages = await clientService.getAdminChatMessages(selectedProject.id);
      setChatMessages(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedProject) return;

    setSendingMessage(true);

    try {
      await clientService.sendAdminChatMessage(selectedProject.id, chatMessage);
      setChatMessage('');
      fetchChatMessages();
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const refreshSelectedProject = async () => {
    if (!selectedProject) return;
    try {
      const updated = await clientService.getProject(selectedProject.id);
      setSelectedProject(updated);
      fetchProjects();
    } catch (error) {
      console.error('Error refreshing project:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProject) {
        await clientService.updateClientProject(editingProject.id, formData);
        toast.success('Project updated successfully');
      } else {
        await clientService.createClientProject(formData);
        toast.success('Project created successfully');
      }

      fetchProjects();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(getErrorMessage(error, 'Failed to save project'));
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await clientService.deleteClientProject(projectId);
      toast.success('Project deleted successfully');
      fetchProjects();
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(getErrorMessage(error, 'Failed to delete project'));
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      client_id: project.client_id,
      description: project.description || '',
      status: project.status,
      priority: project.priority || 'medium',
      progress: project.progress,
      start_date: project.start_date || '',
      expected_delivery: project.expected_delivery || '',
      notes: project.notes || '',
      tags: project.tags || []
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      client_id: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      progress: 0,
      start_date: '',
      expected_delivery: '',
      notes: '',
      tags: []
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileUpload = async (projectId, file) => {
    setUploadingFile(true);
    try {
      await clientService.uploadProjectFile(projectId, file);
      toast.success('File uploaded successfully');
      refreshSelectedProject();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (projectId, fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await clientService.deleteProjectFile(projectId, fileId);
      toast.success('File deleted successfully');
      refreshSelectedProject();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  // Milestone handlers
  const handleAddMilestone = async (milestoneData) => {
    try {
      await clientService.addMilestone(selectedProject.id, milestoneData);
      toast.success('Milestone added successfully');
      refreshSelectedProject();
      setMilestoneDialog({ open: false, data: null });
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error(getErrorMessage(error, 'Failed to add milestone'));
    }
  };

  const handleUpdateMilestone = async (milestoneId, milestoneData) => {
    try {
      await clientService.updateMilestone(selectedProject.id, milestoneId, milestoneData);
      toast.success('Milestone updated successfully');
      refreshSelectedProject();
      setMilestoneDialog({ open: false, data: null });
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast.error(getErrorMessage(error, 'Failed to update milestone'));
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (!window.confirm('Are you sure you want to delete this milestone?')) return;

    try {
      await clientService.deleteMilestone(selectedProject.id, milestoneId);
      toast.success('Milestone deleted successfully');
      refreshSelectedProject();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast.error(getErrorMessage(error, 'Failed to delete milestone'));
    }
  };

  // Task handlers
  const handleAddTask = async (taskData) => {
    try {
      await clientService.addTask(selectedProject.id, taskData);
      toast.success('Task added successfully');
      refreshSelectedProject();
      setTaskDialog({ open: false, data: null });
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error(getErrorMessage(error, 'Failed to add task'));
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await clientService.updateTask(selectedProject.id, taskId, taskData);
      toast.success('Task updated successfully');
      refreshSelectedProject();
      setTaskDialog({ open: false, data: null });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(getErrorMessage(error, 'Failed to update task'));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await clientService.deleteTask(selectedProject.id, taskId);
      toast.success('Task deleted successfully');
      refreshSelectedProject();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(getErrorMessage(error, 'Failed to delete task'));
    }
  };

  // Team handlers
  const handleAddTeamMember = async (memberData) => {
    try {
      await clientService.addTeamMember(selectedProject.id, memberData);
      toast.success('Team member added successfully');
      refreshSelectedProject();
      setTeamDialog({ open: false, data: null });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error(getErrorMessage(error, 'Failed to add team member'));
    }
  };

  const handleRemoveTeamMember = async (adminId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) return;

    try {
      await clientService.removeTeamMember(selectedProject.id, adminId);
      toast.success('Team member removed successfully');
      refreshSelectedProject();
    } catch (error) {
      console.error('Error removing team member:', error);
      toast.error(getErrorMessage(error, 'Failed to remove team member'));
    }
  };

  // Budget handler
  const handleUpdateBudget = async (budgetData) => {
    try {
      await clientService.updateBudget(selectedProject.id, budgetData);
      toast.success('Budget updated successfully');
      refreshSelectedProject();
      setBudgetDialog({ open: false, data: null });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error(getErrorMessage(error, 'Failed to update budget'));
    }
  };

  // Enhanced features handlers
  const handleBulkDelete = async () => {
    if (selectedProjects.length === 0) {
      toast.error('No projects selected');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedProjects.length} project(s)?`)) {
      return;
    }

    try {
      await Promise.all(selectedProjects.map(id => clientService.deleteClientProject(id)));
      toast.success(`${selectedProjects.length} project(s) deleted successfully`);
      setSelectedProjects([]);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting projects:', error);
      toast.error('Failed to delete some projects');
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedProjects.length === 0) {
      toast.error('No projects selected');
      return;
    }

    try {
      await Promise.all(selectedProjects.map(id =>
        clientService.updateClientProject(id, { status: newStatus })
      ));
      toast.success(`${selectedProjects.length} project(s) updated successfully`);
      setSelectedProjects([]);
      fetchProjects();
    } catch (error) {
      console.error('Error updating projects:', error);
      toast.error('Failed to update some projects');
    }
  };

  const handleExportProjects = () => {
    const dataToExport = filteredProjects.map(p => ({
      Name: p.name,
      Client: getClientName(p.client_id),
      Status: getStatusLabel(p.status),
      Priority: p.priority,
      Progress: `${p.progress}%`,
      'Expected Delivery': p.expected_delivery || 'N/A',
    }));

    const csv = [
      Object.keys(dataToExport[0] || {}).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Projects exported successfully');
  };

  const handleDuplicateProject = async (project) => {
    try {
      const duplicateData = {
        name: `${project.name} (Copy)`,
        client_id: project.client_id,
        description: project.description,
        status: 'pending',
        priority: project.priority,
        progress: 0,
        notes: project.notes,
      };
      await clientService.createClientProject(duplicateData);
      toast.success('Project duplicated successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error duplicating project:', error);
      toast.error('Failed to duplicate project');
    }
  };

  const toggleProjectSelection = (projectId) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleAllProjects = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-brand-100 text-brand-800',
      review: 'bg-brand-100 text-brand-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      review: 'Under Review',
      completed: 'Completed'
    };
    return labels[status] || status;
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1800px] mx-auto" data-testid="client-projects-manager">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Client Projects</h1>
          <p className="text-gray-600 mt-1.5">Manage client projects and deliverables</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto justify-center self-center sm:self-auto"
          data-testid="create-project-btn"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Projects List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">All Projects ({projects.length})</h2>
            </div>
            <div className="divide-y max-h-[calc(100vh-250px)] overflow-y-auto">
              {projects.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">No projects found.</p>
                  <p className="text-xs mt-2">Create your first project to get started.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedProject?.id === project.id ? 'bg-brand-50 border-l-4 border-brand-600' : ''
                    }`}
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab('overview');
                    }}
                    data-testid={`project-item-${project.id}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate leading-tight">{project.name}</h3>
                        <p className="text-xs text-gray-600 truncate mt-1.5">{getClientName(project.client_id)}</p>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} text-xs shrink-0 self-start`}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="lg:col-span-9">
          {selectedProject ? (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900 text-xl truncate leading-tight">{selectedProject.name}</h2>
                    <p className="text-sm text-gray-600 truncate mt-1.5">{getClientName(selectedProject.client_id)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(selectedProject)}
                      data-testid="edit-selected-project-btn"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedProject.id)}
                      className="text-red-600 hover:text-red-700"
                      data-testid="delete-selected-project-btn"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="overflow-x-auto mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6">
                    <TabsList className="inline-flex w-auto min-w-full">
                      <TabsTrigger value="overview" className="flex-shrink-0">Overview</TabsTrigger>
                      <TabsTrigger value="milestones" className="flex-shrink-0">
                        <Target className="w-4 h-4 mr-1" />
                        Milestones
                      </TabsTrigger>
                      <TabsTrigger value="tasks" className="flex-shrink-0">
                        <ListChecks className="w-4 h-4 mr-1" />
                        Tasks
                      </TabsTrigger>
                      <TabsTrigger value="team" className="flex-shrink-0">
                        <Users className="w-4 h-4 mr-1" />
                        Team
                      </TabsTrigger>
                      <TabsTrigger value="budget" className="flex-shrink-0">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Budget
                      </TabsTrigger>
                      <TabsTrigger value="files" className="flex-shrink-0">
                        <FileText className="w-4 h-4 mr-1" />
                        Files
                      </TabsTrigger>
                      <TabsTrigger value="activity" className="flex-shrink-0">
                        <Activity className="w-4 h-4 mr-1" />
                        Activity
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="flex-shrink-0">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600 text-sm font-medium">Status</Label>
                        <div className="mt-1">
                          <Badge className={getStatusColor(selectedProject.status)}>
                            {getStatusLabel(selectedProject.status)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 text-sm font-medium">Progress</Label>
                        <p className="font-medium mt-1">{selectedProject.progress}%</p>
                        <Progress value={selectedProject.progress} className="h-2 mt-2" />
                      </div>
                    </div>
                    {selectedProject.description && (
                      <div>
                        <Label className="text-gray-600 text-sm font-medium">Description</Label>
                        <p className="text-gray-900 mt-1">{selectedProject.description}</p>
                      </div>
                    )}
                    {selectedProject.expected_delivery && (
                      <div>
                        <Label className="text-gray-600 text-sm font-medium">Expected Delivery</Label>
                        <p className="font-medium mt-1">
                          {new Date(selectedProject.expected_delivery).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedProject.notes && (
                      <div>
                        <Label className="text-gray-600 text-sm font-medium">Notes</Label>
                        <div className="bg-gray-50 p-3 rounded whitespace-pre-wrap text-sm mt-1">
                          {selectedProject.notes}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Milestones Tab */}
                  <TabsContent value="milestones" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        size="sm"
                        onClick={() => setMilestoneDialog({ open: true, data: null })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Milestone
                      </Button>
                    </div>
                    {selectedProject.milestones && selectedProject.milestones.length > 0 ? (
                      selectedProject.milestones.map((milestone) => (
                        <div key={milestone.id} className="bg-gray-50 border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                              {milestone.description && (
                                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(milestone.status)}>
                                {milestone.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMilestoneDialog({ open: true, data: milestone })}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMilestone(milestone.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {milestone.due_date && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Due: {new Date(milestone.due_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No milestones yet</p>
                    )}
                  </TabsContent>

                  {/* Tasks Tab */}
                  <TabsContent value="tasks" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        size="sm"
                        onClick={() => setTaskDialog({ open: true, data: null })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                    {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                      selectedProject.tasks.map((task) => (
                        <div key={task.id} className="bg-gray-50 border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <CheckCircle2
                                className={`w-5 h-5 mt-0.5 ${
                                  task.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                                }`}
                              />
                              <div className="flex-1">
                                <h4 className={`font-semibold ${
                                  task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}>
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                )}
                                {task.due_date && (
                                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setTaskDialog({ open: true, data: task })}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No tasks yet</p>
                    )}
                  </TabsContent>

                  {/* Team Tab */}
                  <TabsContent value="team" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        size="sm"
                        onClick={() => setTeamDialog({ open: true, data: null })}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Team Member
                      </Button>
                    </div>
                    {selectedProject.team_members && selectedProject.team_members.length > 0 ? (
                      selectedProject.team_members.map((member, idx) => (
                        <div key={idx} className="bg-gray-50 border rounded-lg p-4 flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{member.admin_name}</h4>
                            {member.role && (
                              <p className="text-sm text-gray-600">{member.role}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Added {new Date(member.added_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTeamMember(member.admin_id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No team members yet</p>
                    )}
                  </TabsContent>

                  {/* Budget Tab */}
                  <TabsContent value="budget">
                    <div className="flex justify-end mb-4">
                      <Button
                        size="sm"
                        onClick={() => setBudgetDialog({ open: true, data: selectedProject.budget })}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Budget
                      </Button>
                    </div>
                    {selectedProject.budget ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-brand-50 border rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Total</p>
                            <p className="text-2xl font-bold text-brand-600">
                              {selectedProject.budget.currency} {selectedProject.budget.total_amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-green-50 border rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Paid</p>
                            <p className="text-2xl font-bold text-green-600">
                              {selectedProject.budget.currency} {selectedProject.budget.paid_amount.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-orange-50 border rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {selectedProject.budget.currency} {selectedProject.budget.pending_amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {selectedProject.budget.payment_terms && (
                          <div className="bg-gray-50 border rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Payment Terms</h4>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {selectedProject.budget.payment_terms}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No budget information set</p>
                        <Button onClick={() => setBudgetDialog({ open: true, data: null })}>
                          Set Budget
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Files Tab */}
                  <TabsContent value="files" className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        size="sm"
                        onClick={() => document.getElementById('file-upload').click()}
                        disabled={uploadingFile}
                        data-testid="upload-file-btn"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingFile ? 'Uploading...' : 'Upload File'}
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(selectedProject.id, e.target.files[0]);
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                    {selectedProject.files && selectedProject.files.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProject.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between bg-gray-50 border p-3 rounded"
                            data-testid={`file-item-${file.id}`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <FileText className="w-5 h-5 text-brand-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.filename}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(file.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFile(selectedProject.id, file.id)}
                              className="text-red-600"
                              data-testid={`delete-file-btn-${file.id}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No files uploaded yet</p>
                    )}
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-3 max-h-[500px] overflow-y-auto">
                    {selectedProject.activity_log && selectedProject.activity_log.length > 0 ? (
                      selectedProject.activity_log.slice().reverse().map((activity) => (
                        <div key={activity.id} className="bg-white border-l-4 border-brand-500 p-4 rounded-r-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                by {activity.user_name} • {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="outline">{activity.action}</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No activity yet</p>
                    )}
                  </TabsContent>

                  {/* Chat Tab */}
                  <TabsContent value="chat" className="space-y-4">
                    <div className="flex flex-col h-[500px]">
                      {/* Chat Messages */}
                      <div className="bg-gray-50 border rounded-lg p-4 flex-1 overflow-y-auto mb-4">
                        {chatMessages.length > 0 ? (
                          <div className="space-y-4">
                            {chatMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg p-3 ${
                                    msg.sender_type === 'admin'
                                      ? 'bg-brand-600 text-white'
                                      : 'bg-white border text-gray-900'
                                  }`}
                                >
                                  <p className="text-xs font-semibold mb-1 opacity-80">
                                    {msg.sender_name}
                                  </p>
                                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                  <p className="text-xs mt-1 opacity-70">
                                    {new Date(msg.created_at).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-sm">No messages yet</p>
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Textarea
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1"
                          rows={2}
                          disabled={sendingMessage}
                          data-testid="admin-chat-input"
                        />
                        <Button
                          type="submit"
                          disabled={sendingMessage || !chatMessage.trim()}
                          data-testid="admin-send-message-btn"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border">
              <div className="py-16 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Select a project to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col" data-testid="project-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject ? 'Update project details' : 'Assign a new project to a client'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 py-4 overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  data-testid="project-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_id">Client *</Label>
                <Select
                  name="client_id"
                  value={formData.client_id}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value })}
                  required
                >
                  <SelectTrigger data-testid="project-client-select">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.filter(c => c.is_active).map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  data-testid="project-description-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger data-testid="project-status-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="review">Under Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input
                    id="progress"
                    name="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleChange}
                    data-testid="project-progress-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_delivery">Expected Delivery</Label>
                <Input
                  id="expected_delivery"
                  name="expected_delivery"
                  type="date"
                  value={formData.expected_delivery}
                  onChange={handleChange}
                  data-testid="project-delivery-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Visible to Client)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Add any notes or updates for the client..."
                  data-testid="project-notes-input"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" data-testid="save-project-btn">
                {editingProject ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Milestone Dialog */}
      <MilestoneDialog
        open={milestoneDialog.open}
        data={milestoneDialog.data}
        onClose={() => setMilestoneDialog({ open: false, data: null })}
        onSave={milestoneDialog.data ? handleUpdateMilestone : handleAddMilestone}
      />

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialog.open}
        data={taskDialog.data}
        milestones={selectedProject?.milestones || []}
        onClose={() => setTaskDialog({ open: false, data: null })}
        onSave={taskDialog.data ? handleUpdateTask : handleAddTask}
      />

      {/* Team Dialog */}
      <TeamDialog
        open={teamDialog.open}
        data={teamDialog.data}
        onClose={() => setTeamDialog({ open: false, data: null })}
        onSave={handleAddTeamMember}
      />

      {/* Budget Dialog */}
      <BudgetDialog
        open={budgetDialog.open}
        data={budgetDialog.data}
        onClose={() => setBudgetDialog({ open: false, data: null })}
        onSave={handleUpdateBudget}
      />
    </div>
  );
}

// Milestone Dialog Component
function MilestoneDialog({ open, data, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'pending',
    order: 0
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        due_date: data.due_date || '',
        status: data.status || 'pending',
        order: data.order || 0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'pending',
        order: 0
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data) {
      onSave(data.id, formData);
    } else {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
          <DialogDescription>
            {data ? 'Update milestone details and status' : 'Create a new milestone for this project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="milestone-title">Title *</Label>
              <Input
                id="milestone-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="milestone-description">Description</Label>
              <Textarea
                id="milestone-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="milestone-due-date">Due Date</Label>
              <Input
                id="milestone-due-date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="milestone-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {data ? 'Update' : 'Add'} Milestone
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Task Dialog Component
function TaskDialog({ open, data, milestones, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: '',
    milestone_id: 'none',
    assigned_to: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        due_date: data.due_date || '',
        milestone_id: data.milestone_id || 'none',
        assigned_to: data.assigned_to || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: '',
        milestone_id: 'none',
        assigned_to: ''
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert 'none' back to empty string/null for milestone_id
    const submitData = {
      ...formData,
      milestone_id: formData.milestone_id === 'none' ? null : formData.milestone_id
    };
    if (data) {
      onSave(data.id, submitData);
    } else {
      onSave(submitData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? 'Edit Task' : 'Add Task'}</DialogTitle>
          <DialogDescription>
            {data ? 'Update task details and status' : 'Create a new task for this project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="task-title">Title *</Label>
              <Input
                id="task-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            {milestones.length > 0 && (
              <div>
                <Label htmlFor="task-milestone">Milestone (Optional)</Label>
                <Select
                  value={formData.milestone_id}
                  onValueChange={(value) => setFormData({ ...formData, milestone_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {milestones.map((milestone) => (
                      <SelectItem key={milestone.id} value={milestone.id}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {data ? 'Update' : 'Add'} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Team Dialog Component
function TeamDialog({ open, data, onClose, onSave }) {
  const [formData, setFormData] = useState({
    admin_id: '',
    admin_name: '',
    role: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Assign an admin user to this project as a team member
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="admin-id">Admin ID *</Label>
              <Input
                id="admin-id"
                value={formData.admin_id}
                onChange={(e) => setFormData({ ...formData, admin_id: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-name">Admin Name *</Label>
              <Input
                id="admin-name"
                value={formData.admin_name}
                onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Project Manager, Developer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Team Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Budget Dialog Component
function BudgetDialog({ open, data, onClose, onSave }) {
  const [formData, setFormData] = useState({
    total_amount: 0,
    currency: 'INR',
    paid_amount: 0,
    payment_terms: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        total_amount: data.total_amount || 0,
        currency: data.currency || 'INR',
        paid_amount: data.paid_amount || 0,
        payment_terms: data.payment_terms || ''
      });
    } else {
      setFormData({
        total_amount: 0,
        currency: 'INR',
        paid_amount: 0,
        payment_terms: ''
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? 'Update Budget' : 'Set Budget'}</DialogTitle>
          <DialogDescription>
            {data ? 'Update project budget and payment information' : 'Set the budget and payment terms for this project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total-amount">Total Amount *</Label>
                <Input
                  id="total-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="paid-amount">Paid Amount</Label>
              <Input
                id="paid-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.paid_amount}
                onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Textarea
                id="payment-terms"
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                rows={4}
                placeholder="Describe payment terms..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{data ? 'Update' : 'Set'} Budget</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
