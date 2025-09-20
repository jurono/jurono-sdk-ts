import { JuronoApiClient } from '../src/client';
import { Blog } from '../src/endpoints/blog';
import { mockFetch } from './setup';

describe('Blog', () => {
  const client = new JuronoApiClient({ apiKey: 'test-key' });
  const blog = new Blog(client);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Posts Management', () => {
    it('should list blog posts', async () => {
      const mockData = {
        posts: [
          { id: 'post-1', title: 'First Post', status: 'published', author: { id: 'user-1', name: 'John Doe' } },
          { id: 'post-2', title: 'Second Post', status: 'draft', author: { id: 'user-1', name: 'John Doe' } }
        ],
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 }
      };
      mockFetch(mockData);

      const result = await blog.posts.list({ status: 'published', page: 1, limit: 10 });
      expect(result.data.posts).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/posts?page=1&limit=10&status=published'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should get blog post by id', async () => {
      const mockData = {
        id: 'post-123',
        title: 'Test Post',
        content: 'Post content',
        status: 'published',
        author: { id: 'user-1', name: 'John Doe', email: 'john@test.com' },
        category: { id: 'cat-1', name: 'Tech' },
        tags: [{ id: 'tag-1', name: 'JavaScript' }]
      };
      mockFetch(mockData);

      const result = await blog.posts.getById('post-123');
      expect(result.data.title).toBe('Test Post');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/posts/post-123'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should create blog post', async () => {
      const mockData = { id: 'post-123', title: 'New Post', status: 'draft' };
      const postData = {
        title: 'New Post',
        excerpt: 'Post excerpt',
        content: 'Post content',
        categoryId: 'cat-1',
        tagIds: ['tag-1', 'tag-2']
      };
      mockFetch(mockData);

      const result = await blog.posts.create(postData);
      expect(result.data.id).toBe('post-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/posts'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData)
        })
      );
    });

    it('should update blog post', async () => {
      const mockData = { id: 'post-123', title: 'Updated Post', status: 'published' };
      const updateData = { title: 'Updated Post', status: 'published' as const };
      mockFetch(mockData);

      const result = await blog.posts.update('post-123', updateData);
      expect(result.data.title).toBe('Updated Post');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/posts/post-123'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData)
        })
      );
    });

    it('should publish blog post', async () => {
      const mockData = { id: 'post-123', status: 'published', publishedAt: '2024-01-01T00:00:00Z' };
      mockFetch(mockData);

      const result = await blog.posts.publish('post-123');
      expect(result.data.status).toBe('published');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/posts/post-123/publish'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should unpublish blog post', async () => {
      const mockData = { id: 'post-123', status: 'draft', publishedAt: null };
      mockFetch(mockData);

      const result = await blog.posts.unpublish('post-123');
      expect(result.data.status).toBe('draft');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/posts/post-123/unpublish'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should delete blog post', async () => {
      mockFetch({});

      await blog.posts.delete('post-123');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/posts/post-123'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('Categories Management', () => {
    it('should list categories', async () => {
      const mockData = [
        { id: 'cat-1', name: 'Technology', slug: 'technology', postCount: 15 },
        { id: 'cat-2', name: 'Business', slug: 'business', postCount: 8 }
      ];
      mockFetch(mockData);

      const result = await blog.categories.list();
      expect(result.data).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/categories'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should create category', async () => {
      const mockData = { id: 'cat-123', name: 'New Category', slug: 'new-category' };
      const categoryData = { name: 'New Category', description: 'Category description' };
      mockFetch(mockData);

      const result = await blog.categories.create(categoryData);
      expect(result.data.name).toBe('New Category');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/categories'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(categoryData)
        })
      );
    });
  });

  describe('Tags Management', () => {
    it('should list tags', async () => {
      const mockData = [
        { id: 'tag-1', name: 'JavaScript', slug: 'javascript', postCount: 25 },
        { id: 'tag-2', name: 'React', slug: 'react', postCount: 18 }
      ];
      mockFetch(mockData);

      const result = await blog.tags.list();
      expect(result.data).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/tags'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should create tag', async () => {
      const mockData = { id: 'tag-123', name: 'New Tag', slug: 'new-tag' };
      const tagData = { name: 'New Tag', color: '#ff0000' };
      mockFetch(mockData);

      const result = await blog.tags.create(tagData);
      expect(result.data.name).toBe('New Tag');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/tags'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(tagData)
        })
      );
    });
  });

  describe('Analytics', () => {
    it('should get blog analytics', async () => {
      const mockData = {
        overview: {
          totalPosts: 50,
          publishedPosts: 45,
          draftPosts: 5,
          totalViews: 10000,
          monthlyViews: 2500,
          uniqueVisitors: 1500,
          averageReadTime: 4.5
        },
        popularPosts: [
          { id: 'post-1', title: 'Popular Post', views: 500, engagement: 85 }
        ],
        categoryStats: [
          { categoryId: 'cat-1', categoryName: 'Tech', postCount: 25, views: 5000 }
        ]
      };
      mockFetch(mockData);

      const result = await blog.analytics.get();
      expect(result.data.overview.totalPosts).toBe(50);
      expect(result.data.popularPosts).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/blog/analytics'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });
});