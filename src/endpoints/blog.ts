import { JuronoApiClient } from '../client';
import type { ApiResponse } from '../types';

// Blog types
export interface BlogPostParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published' | 'archived';
  categoryId?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  category: BlogCategory;
  tags: BlogTag[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  status?: 'draft' | 'published';
  featuredImage?: string;
  categoryId: string;
  tagIds?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  publishedAt?: string;
}

export interface UpdateBlogPostData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  status?: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  categoryId?: string;
  tagIds?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  publishedAt?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  parentId?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  parentId?: string;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  parentId?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagData {
  name: string;
  slug?: string;
  color?: string;
}

export interface UpdateTagData {
  name?: string;
  slug?: string;
  color?: string;
}

export interface BlogAnalytics {
  overview: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    monthlyViews: number;
    uniqueVisitors: number;
    averageReadTime: number;
  };
  popularPosts: {
    id: string;
    title: string;
    views: number;
    engagement: number;
  }[];
  categoryStats: {
    categoryId: string;
    categoryName: string;
    postCount: number;
    views: number;
  }[];
  tagStats: {
    tagId: string;
    tagName: string;
    postCount: number;
    popularity: number;
  }[];
  trafficSources: {
    source: string;
    visitors: number;
    percentage: number;
  }[];
  viewsOverTime: {
    date: string;
    views: number;
    uniqueVisitors: number;
  }[];
}

export class Blog {
  constructor(private client: JuronoApiClient) {}

  // Posts management
  posts = {
    list: (params: BlogPostParams = {}): Promise<ApiResponse<BlogPostsResponse>> => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.status) queryParams.set('status', params.status);
      if (params.categoryId) queryParams.set('categoryId', params.categoryId);
      if (params.tags?.length) queryParams.set('tags', params.tags.join(','));
      if (params.search) queryParams.set('search', params.search);
      if (params.sortBy) queryParams.set('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

      const query = queryParams.toString();
      return this.client.request(`/admin/blog/posts${query ? `?${query}` : ''}`, 'GET');
    },

    getById: (id: string): Promise<ApiResponse<BlogPost>> => {
      return this.client.request(`/admin/blog/posts/${id}`, 'GET');
    },

    create: (data: CreateBlogPostData): Promise<ApiResponse<BlogPost>> => {
      return this.client.request('/admin/blog/posts', 'POST', data);
    },

    update: (id: string, data: UpdateBlogPostData): Promise<ApiResponse<BlogPost>> => {
      return this.client.request(`/admin/blog/posts/${id}`, 'PUT', data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/blog/posts/${id}`, 'DELETE');
    },

    publish: (id: string): Promise<ApiResponse<BlogPost>> => {
      return this.client.request(`/admin/blog/posts/${id}/publish`, 'POST');
    },

    unpublish: (id: string): Promise<ApiResponse<BlogPost>> => {
      return this.client.request(`/admin/blog/posts/${id}/unpublish`, 'POST');
    }
  };

  // Categories management
  categories = {
    list: (): Promise<ApiResponse<BlogCategory[]>> => {
      return this.client.request('/admin/blog/categories', 'GET');
    },

    create: (data: CreateCategoryData): Promise<ApiResponse<BlogCategory>> => {
      return this.client.request('/admin/blog/categories', 'POST', data);
    },

    update: (id: string, data: UpdateCategoryData): Promise<ApiResponse<BlogCategory>> => {
      return this.client.request(`/admin/blog/categories/${id}`, 'PUT', data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/blog/categories/${id}`, 'DELETE');
    }
  };

  // Tags management
  tags = {
    list: (): Promise<ApiResponse<BlogTag[]>> => {
      return this.client.request('/admin/blog/tags', 'GET');
    },

    create: (data: CreateTagData): Promise<ApiResponse<BlogTag>> => {
      return this.client.request('/admin/blog/tags', 'POST', data);
    },

    update: (id: string, data: UpdateTagData): Promise<ApiResponse<BlogTag>> => {
      return this.client.request(`/admin/blog/tags/${id}`, 'PUT', data);
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
      return this.client.request(`/admin/blog/tags/${id}`, 'DELETE');
    }
  };

  // Analytics
  analytics = {
    get: (): Promise<ApiResponse<BlogAnalytics>> => {
      return this.client.request('/admin/blog/analytics', 'GET');
    }
  };

  // Images upload
  images = {
    upload: (file: File): Promise<ApiResponse<{ url: string }>> => {
      const formData = new FormData();
      formData.append('file', file);

      // Note: This would need special handling in the client.request method for FormData
      return this.client.request('/admin/blog/images/upload', 'POST', formData);
    }
  };
}