import { safeProjectUrl } from '../utils/projectUrls';
import api from './api';
import INITIAL_PROJECTS from '../data/initialProjects';

const CACHE_KEY = 'metechq_cached_projects';
let memoryCache = null;

class ProjectService {
  getCachedProjects() {
    if (memoryCache && memoryCache.length > 0) return memoryCache;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem(CACHE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryCache = parsed;
            return parsed;
          }
        }
      }
    } catch (e) {
      // LocalStorage access may fail in restricted environments
    }
    memoryCache = INITIAL_PROJECTS;
    return INITIAL_PROJECTS;
  }

  saveProjectsToCache(projects) {
    if (!Array.isArray(projects) || projects.length === 0) return;
    memoryCache = projects;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(projects));
      }
    } catch (e) {}
  }
  async getAllProjects() {
    try {
      // For admin - get all projects including private ones
      const projects = [];
      for (let offset = 0; ; offset += 100) {
        const response = await api.get('/projects/all', { params: { offset, limit: 100 } });
        if (!Array.isArray(response.data)) throw new Error('Invalid project response');
        projects.push(...response.data);
        if (response.data.length < 100) return Array.from(new Map(projects.map(project => [project.id, project])).values());
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getPublicProjects() {
    const allProjects = [];
    const pageSize = 100;
    let offset = 0;
    while (true) {
      const response = await api.get('/projects/', { params: { offset, limit: pageSize } });
      if (!Array.isArray(response.data)) throw new Error('Invalid project response');
      allProjects.push(...response.data);
      if (response.data.length < pageSize) break;
      offset += pageSize;
    }
    const transformed = Array.from(new Map(allProjects.map(project => [project.id || project._id || project.slug, project])).values()).filter(project => project.is_private !== true).map(project => ({
      ...project,
      id: String(project.id || project._id || project.slug),
      title: project.title || 'Untitled project',
      description: project.description || '',
      category: project.category || 'Web development',
      image_url: safeProjectUrl(project.image_url || project.image),
      live_demo_url: safeProjectUrl(project.live_demo_url || project.liveUrl),
      github_url: safeProjectUrl(project.github_url || project.githubUrl),
      images: [project.image_url || project.image, ...(project.gallery_images || project.images || [])].map(safeProjectUrl).filter((url, index, list) => url && list.indexOf(url) === index),
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : (project.technologies || [])
    }));
    if (transformed.length > 0) {
      this.saveProjectsToCache(transformed);
    }
    return transformed;
  }

  async getProject(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  async createProject(projectData) {
    try {
      const response = await api.post('/projects/', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id, projectData) {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
    try {
      const response = await api.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }
}

export default new ProjectService();
